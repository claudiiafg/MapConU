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
  private poiMarker: any;
  private isInit: boolean = true;

  constructor(
    private events: Events,
    private indoorDirectionsService: IndoorDirectionsService,
    private directionManager: DirectionsManagerService,
    private router: Router,
    private dataSharing: DataSharingService
  ) {}

  ngOnInit() {

    //subscribe to change in floor
    //hen user changes floor in the indoor-toolbar
    this.events.subscribe('initNewMap', () =>{
      //if is new floor plan init new map
      this.isInit = true;
    });

    //subscribe to 'floorplan'.ts onInit
    //when a floor component is loaded -> setup map
    this.events.subscribe('floor-loaded', res => {
      if(this.inputBuilding === res.building && this.isInit){
        this.isInit = false;
        this.setMap();
        this.dataSharing.updateCurrentBuilding(this.inputBuilding);
      }
    });

    //published by indoorDirectensService, when a path is found
    //when path is found -> display lines of path on map
    this.events.subscribe('path-found', () => {
      this.path = this.indoorDirectionsService.getPath();
      this.foundPath = true;
      setTimeout(() => {
        for (let line of this.path) {
          let docElement = document.getElementById(line);
          docElement.style.stroke = 'blue';
        }
        this.setMarker();
      }, 500)

    });

    //when user ends route -> reset navidation
    //published in indoor-side-buttons, when clicked on X
    this.events.subscribe('path-completed', res => {
      this.resetNav();
      this.directionManager.resetSteps();
    });

    //published in 2 places:
      //when user presses go in the room-selector-popover (same floor directions)
      //after a floorplan is loaded, if directions are on route, initiate path in that floor plan
    //when user wants to start a new path -> get data necessary and compute path
    this.events.subscribe('init-new-path', data => {
      if (data) {
        this.resetNav();
        this.sourceID = data.source;
        this.destID = data.destination;
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
        ele.includes('vl1') ||
        ele.includes('elevator') ||
        ele.includes('escalator') ||
        ele.includes('stairs')
      ) {
        this.resetNav();
        this.initNav(ele);
      }
    });

    this.dataSharing.showPoi.subscribe( markerId =>{
      let poiMarkerId = markerId[0].concat('-marker');
        this.poiMarker = document.getElementById(poiMarkerId);
      if(poiMarkerId != 'poiToShow-marker') {
        try {
          this.poiMarker.style.visibility = 'visible';
        }
        catch(Exception){
          console.log(this.poiMarker, ' not found for current map');
        }
      }
    });

    this.dataSharing.hidePoi.subscribe( markerId =>{
      let poiMarkerId = markerId[0].concat('-marker');
        this.poiMarker = document.getElementById(poiMarkerId);
        if(poiMarkerId != 'poiToHide-marker') {
          try {
            this.poiMarker.style.visibility = 'hidden';
          }
          catch(Exception){
            console.log(this.poiMarker, ' not found for current map');
          }
      }
    });
  }

  //when indoor component is first initiated
  ngAfterViewInit() {
    this.subscribeToshowToa();
  }

  public subscribeToshowToa(){
    this.dataSharing.showToa.subscribe(updateShow =>{
      if (updateShow === false){
        this.resetNav();
        this.unsetMarker();
      }
    })
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
    } else if(this.inputBuilding === 'jmsb'){
      currentDoc = document.getElementById('mb1-plan-wrapper');
    } else if(this.inputBuilding === 'vanier'){
      currentDoc = document.getElementById('vl1-plan-wrapper');
    }
    let docElementLines = currentDoc.getElementsByTagName('line');
    let docInterestPoints = currentDoc.getElementsByTagName('circle');

    //set map in service and get all info from it
    this.indoorDirectionsService.setMap(docElementLines, docInterestPoints);
    this.pathLines = this.indoorDirectionsService.getLines();
    this.interestPoints = this.indoorDirectionsService.getPoints();

    //when map is set, send event so any path waiting to start can begin
    const data = {
      building: this.inputBuilding,
      floor: this.floor,
    }

    //publish that map has been set
    //services are subscribred to this event so no directions begins before all elements have been set
    this.events.publish('map-set', data, Date.now());
    this.marker = document.getElementById('marker');
    this.unsetMarker();
  }

  //initiate the process of navigation (when user click on a element)
  public initNav(name: string) {
    const point: Point = this.indoorDirectionsService.getPointByName(name);
    if (point) {
      this.inputBuilding = this.router.url.substring(this.router.url.lastIndexOf('/') + 1, this.router.url.length);

      this.destID = point.id;
      this.isSelectMode = this.directionManager.getIsSelectMode();

      //user wants floor to floor directions (isSelectMode)
      //the room he just selected is to be concated to the already existing steps of navigation
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
        } else if (this.inputBuilding === 'vanier') {
          this.directionManager.initDifferentFloorDir(
            false,
            'vl1',
            this.destID
          );
        }

      //is not selecte mode -> initiating first step
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
        } else if (this.inputBuilding === 'vanier') {
          this.directionManager.initiateIndoorDirections(
            'vl1',
            this.destID,
            this.interestPoints
          );
        }
      }
    } else {
      console.log('Point not available.');
    }
  }

  //in order to avoid data corruption
  //checks html to see which floorplan is currently loaded
  private checkCurrentFloorNumber(): number{
    let h8 = document.getElementById('h8-plan-wrapper');
    let h9 = document.getElementById('h9-plan-wrapper');
    let mb1 = document.getElementById('mb1-plan-wrapper');
    let vl1 = document.getElementById('vl1-plan-wrapper');

    if(h8){
      return 8;
    } else if(h9) {
      return 9;
    } else if(mb1 || vl1) {
      return 1;
    }

  }

  //set marker on the map
  private setMarker() {
    const point = this.indoorDirectionsService.getPointByName(this.destID);
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
    if(this.marker){
      this.marker.style.visibility = 'hidden';
    }
  }

  //called when route is cancelled or ended
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
  //destroy component on unload so the ngAfterViewInit get's triggered everytime the indoor page is opened
  //helps avoid data corruption -> data is reset everytime
  @HostListener('unloaded')
  ngOnDestroy() {}
}
