import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';
import {
  Line,
  Point,
  IndoorDirectionsService
} from 'src/services/indoorDirections.service';
import { DirectionsManagerService } from 'src/services/directionsManager.service';

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

  constructor(
    private events: Events,
    private indoorDirectionsService: IndoorDirectionsService,
    private directionManager: DirectionsManagerService
  ) {
    //when floor component is loaded -> setup map
    this.events.subscribe('floor-loaded', () => {
      this.setMap();
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
        this.indoorDirectionsService.computePathHelper(
          this.sourceID,
          this.destID
        );
      }
    });

    //add event listener to all 'points of interest' elements of map
    document.addEventListener('click', (res: any) => {
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

  ngOnInit() {}

  //when indoor component is first initiated
  ngAfterViewInit() {
    this.setMap();
  }

  //get all element from floor plan and setup indoorDirections map
  setMap() {
    if (this.directionManager.getIsSelectMode()) {
      this.isSelectMode = true;
    }

    let docElementLines = document.getElementsByTagName('line');
    let docInterestPoints = document.getElementsByTagName('circle');
    this.marker = document.getElementById('marker');
    this.marker.style.visibility = 'hidden';

    this.indoorDirectionsService.setMap(docElementLines, docInterestPoints);
    this.pathLines = this.indoorDirectionsService.getLines();
    this.interestPoints = this.indoorDirectionsService.getPoints();
    this.events.publish('map-set', true, Date.now());
  }

  //initiate the process of navigation (when user click on a element)
  public initNav(name: string) {
    let point: Point;

    if (name.includes('mb')) {
      point = this.interestPoints.filter(point => point.id === name)[0];
    } else if (name.includes('h8')) {
      point = this.interestPoints.filter(point => point.id === name)[0];
    } else if (name.includes('h9')) {
      point = this.interestPoints.filter(point => point.id === name)[0];
    } else if (name.includes('elevator')) {
      point = this.interestPoints.filter(point => point.id === 'elevator')[0];
    } else if (name.includes('female')) {
      point = this.interestPoints.filter(
        point => point.id === 'h8-wc-female'
      )[0];
    } else if (name.includes('male')) {
      point = this.interestPoints.filter(point => point.id === 'h8-wc-male')[0];
    } else if (name.includes('ne')) {
      point = this.interestPoints.filter(
        point => point.id === 'h8-stairs-ne'
      )[0];
    } else if (name.includes('nw')) {
      point = this.interestPoints.filter(
        point => point.id === 'h8-stairs-nw'
      )[0];
    } else if (name.includes('sw')) {
      point = this.interestPoints.filter(
        point => point.id === 'h8-stairs-sw'
      )[0];
    } else if (name.includes('se')) {
      point = this.interestPoints.filter(
        point => point.id === 'h8-stairs-se'
      )[0];
    } else if (name.includes('escalator-down')) {
      point = this.interestPoints.filter(
        point => point.id === 'h8-escalator-down'
      )[0];
    } else if (name.includes('escalator-up')) {
      point = this.interestPoints.filter(
        point => point.id === 'h8-escalator-up'
      )[0];
    }
    if (point) {
      this.destID = point.id;
      this.setMarker(point);
      this.isSelectMode = this.directionManager.getIsSelectMode();

      //user wants floor to floor directions -> the room he just selected is to be concated to the already existing steps of navigation
      if (this.isSelectMode) {
        if (this.inputBuilding === 'hall' && this.floor === 8) {
          this.directionManager.initDifferentFloorDir(
            false,
            'h8',
            this.destID,
            this.interestPoints
          );
        } else if (this.inputBuilding === 'hall' && this.floor === 9) {
          this.directionManager.initDifferentFloorDir(
            false,
            'h9',
            this.destID,
            this.interestPoints
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

  //set marker on the map
  setMarker(point: Point) {
    this.marker.setAttribute('x', point.x - 26);
    this.marker.setAttribute('y', point.y - 26);
    this.marker.style.visibility = 'visible';
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
}
