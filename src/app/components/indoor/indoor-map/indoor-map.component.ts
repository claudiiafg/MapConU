import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Events } from '@ionic/angular';
import {
  Line,
  Point,
  IndoorDirectionsService
} from 'src/services/indoorDirections.service';
import { DirectionsManagerService } from 'src/services/directionsManager.service';
import { Router } from '@angular/router';
import { DataSharingService} from '../../../../services/data-sharing.service';

@Component({
  selector: 'app-indoor-map',
  templateUrl: './indoor-map.component.html',
  styleUrls: ['./indoor-map.component.scss']
})
export class IndoorMapComponent implements OnInit {
  @Input() inputBuilding: string = '';
  @Input() floor: any;
  @Input() isSelectMode: boolean;

  private pathLines: Line[] = [];
  private interestPoints: Point[] = [];
  private sourceID: string = '';
  private destID: string = '';
  private path: string[] = []; //path of line ids
  private foundPath: boolean = false;
  private marker: any;
  private isInit: boolean = true;

  constructor(
    private events: Events,
    private indoorDirectionsService: IndoorDirectionsService,
    private directionManager: DirectionsManagerService,
    private router: Router,
    private dataSharing: DataSharingService
  ) {}

  ngOnInit() {
    this.events.subscribe('initNewMap', () =>{
      //if is new floor plan init new map
      this.isInit = true;
    });

    //when floor component is loaded -> setup map
    this.events.subscribe('floor-loaded', res => {
      if(this.inputBuilding === res.building && this.isInit){
        this.isInit = false;
        this.setMap();
      }
    });

    //when path is found -> display lines of path on map
    this.events.subscribe('path-found', () => {
      this.path = this.indoorDirectionsService.getPath();
      this.foundPath = true;
      for (let line of this.path) {
        let docElement = document.getElementById(line);
        docElement.style.stroke = 'blue';
      }
    });

    //when user ends route -> reset navidation
    this.events.subscribe('path-completed', res => {
      this.resetNav();
      this.directionManager.resetSteps();
    });

    //when user wants to start a new path -> get data necessary and compute path
    this.events.subscribe('init-new-path', data => {
      if (data) {
        this.resetNav();
        this.sourceID = data.source;
        this.destID = data.destination;
        let p = this.interestPoints.filter(
          point => point.id === this.destID
        )[0];
        this.setMarker(p);
        if(this.sourceID !== this.destID){
          this.indoorDirectionsService.computePathHelper(
            this.sourceID,
            this.destID
          );
        }
      }
    });

    //add event listener to all 'points of interest' elements of map
    document.addEventListener('click', (res: any) => {
      res.stopImmediatePropagation();
      let ele: string = res.toElement.id;
      if (
        ele.includes('wc') ||
        ele.includes('h8') ||
        ele.includes('h9') ||
        ele.includes('mb1') ||
        ele.includes('elevator') ||
        ele.includes('escalator') ||
        ele.includes('stairs')
      ) {
        this.resetNav();
        this.initNav(ele);
      }
    });
  }

  //when indoor component is first initiated
  ngAfterViewInit() {
    this.subscribeToshowToa();
  }

  //get all element from floor plan and setup indoorDirections map
  setMap() {
    if (this.directionManager.getIsSelectMode() === true) {
      this.isSelectMode = true;
    }
    //in order to avoid any mixture of data between floors, target actual div element of the floor plan
    let currentDoc : any;
    if(this.inputBuilding === 'hall' && this.floor === 8){
      currentDoc = document.getElementById('h8-plan-wrapper');
    } else if(this.inputBuilding === 'hall' && this.floor === 9){
      currentDoc = document.getElementById('h9-plan-wrapper');
    } else {
      currentDoc = document.getElementById('mb1-plan-wrapper');
    }
    let docElementLines = currentDoc.getElementsByTagName('line');
    let docInterestPoints = currentDoc.getElementsByTagName('circle');
    this.marker = document.getElementById('marker');
    if(this.marker){
      this.marker.style.visibility = 'hidden';
    }

    //set map in service and get all info from it
    this.indoorDirectionsService.setMap(docElementLines, docInterestPoints);
    this.pathLines = this.indoorDirectionsService.getLines();
    this.interestPoints = this.indoorDirectionsService.getPoints();

    //when map is set, send event so any path waiting to start can begin
    const data = {
      building: this.inputBuilding,
      floor: this.floor,
    }
    this.events.publish('map-set', data, Date.now());
  }

  //initiate the process of navigation (when user click on a element)
  public initNav(name: string) {
    const point: Point = this.indoorDirectionsService.getPointByName(name);
    if (point) {
      this.inputBuilding = this.router.url.substring(this.router.url.lastIndexOf('/') + 1, this.router.url.length);

      this.destID = point.id;
      this.setMarker(point);
      this.isSelectMode = this.directionManager.getIsSelectMode();

      //user wants floor to floor directions -> the room he just selected is to be concated to the already existing steps of navigation
      if (this.isSelectMode === true) {
        this.floor = this.checkCurrentFloorNumber();
        if (this.inputBuilding === 'hall' && this.floor === 8) {
          this.directionManager.initDifferentFloorDir(
            false,
            'h8',
            this.destID
          );
        } else if (this.inputBuilding === 'hall' && this.floor === 9) {
          this.directionManager.initDifferentFloorDir(
            false,
            'h9',
            this.destID
          );
        } else if (this.inputBuilding === 'jmsb') {
          this.directionManager.initDifferentFloorDir(
            false,
            'mb1',
            this.destID
          );
        }

      //initiating first step
      } else {
        if (this.inputBuilding === 'hall' && this.floor === 8) {
          this.directionManager.initiateIndoorDirections(
            'h8',
            this.destID,
            this.interestPoints
          );
        } else if (this.inputBuilding === 'hall' && this.floor === 9) {
          this.directionManager.initiateIndoorDirections(
            'h9',
            this.destID,
            this.interestPoints
          );
        } else if (this.inputBuilding === 'jmsb') {
          this.directionManager.initiateIndoorDirections(
            'mb1',
            this.destID,
            this.interestPoints
          );
        }
      }
    } else {
      console.log('Point not available.');
    }
  }

  private checkCurrentFloorNumber(): number{
    let floor8 = document.getElementById('h8-plan-wrapper');
    let floor9 = document.getElementById('h9-plan-wrapper');
    let floor1 = document.getElementById('mb1-plan-wrapper');

    if(floor8){
      return 8;
    } else if(floor9) {
      return 9;
    } else if(floor1) {
      return 1;
    }

  }

  //set marker on the map
  private setMarker(point: Point) {
    if(point && point.x && point.y){
      if(!this.marker){
        this.marker = document.getElementById('marker');
      }
      this.marker.setAttribute('x', point.x - 26);
      this.marker.setAttribute('y', point.y - 26);
      this.marker.style.visibility = 'visible';
    }
  }

  unsetMarker(){
    this.marker.style.visibility = 'hidden';
  }

  //reset all navigations instance variables in component and indoor directions service
  public resetNav() {
    for (let line of this.path) {
      let docElement = document.getElementById(line);
      if (docElement) {
        docElement.style.stroke = 'transparent';
      }
    }
    this.foundPath = false;
    this.indoorDirectionsService.resetNav();
  }

  //important to reload route
  @HostListener('unloaded')
  ngOnDestroy() {}
}
