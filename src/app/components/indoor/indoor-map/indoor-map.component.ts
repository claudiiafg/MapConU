import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';
import { Line, Point, IndoorDirectionsService } from 'src/services/indoorDirections.service';
import { DirectionsManagerService } from 'src/services/directionsManager.service';

@Component({
  selector: 'app-indoor-map',
  templateUrl: './indoor-map.component.html',
  styleUrls: ['./indoor-map.component.scss']
})
export class IndoorMapComponent implements OnInit{
  @Input() inputBuilding: string = '';
  @Input() floor: any;

  private pathLines: Line[] = [];
  private interestPoints: Point[] = [];
  private sourceID: string = '';
  private destID: string = '';
  private path: string[] = []; //path of line ids
  private foundPath: boolean = false;
  private marker: any;
  private isSelectMode: boolean = false;

  constructor(
    private events: Events,
    private indoorDirectionsService: IndoorDirectionsService,
    private directionManager: DirectionsManagerService,
  ) {
    this.events.subscribe('floor-changes', res => {
      if (res) {
        this.foundPath = false;
        this.floor = parseInt(res);
      }
    });

    this.events.subscribe('floor-loaded', () => {
      this.setMap();
    });


    this.events.subscribe('path-found', () => {
      this.path = this.indoorDirectionsService.getPath();
      this.foundPath = true;
      for (let line of this.path) {
        let docElement = document.getElementById(line);
        docElement.style.stroke = "blue";
      }
    });

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

    document.addEventListener('click', (res: any) => {
      let ele: string = res.toElement.id;
      if (
        ele.includes('wc') ||
        ele.includes('h8') ||
        ele.includes('h9') ||
        ele.includes('elevator') ||
        ele.includes('escalator') ||
        ele.includes('stairs')
      ) {
        this.resetNav();
        this.initNav(ele);
      }
    });
  }

  ngOnInit(){}

  ngAfterViewInit(){
    this.setMap();
  }

  setMap(){
    if(this.directionManager.getIsSelectMode()){
      this.isSelectMode = true;
    }

    let docElementLines = document.getElementsByTagName('line');
    let docInterestPoints = document.getElementsByTagName('circle');
    this.marker = document.getElementById('marker');
    this.marker.style.visibility = 'hidden';

    this.indoorDirectionsService.setMap(docElementLines, docInterestPoints);
    this.pathLines = this.indoorDirectionsService.getLines();
    this.interestPoints = this.indoorDirectionsService.getPoints();
  }

  public initNav(name: string) {
    let point: Point;

    if (name.includes('h8')) {
      point = this.interestPoints.filter(point => point.id === name)[0];
    } else if (name.includes('h9')) {
      point = this.interestPoints.filter(point => point.id === name)[0];
    } else if (name.includes('elevator')) {
      point = this.interestPoints.filter(point => point.id === 'elevator')[0];
    } else if (name.includes('female')) {
      point = this.interestPoints.filter(point => point.id === 'h8-wc-female')[0];
    } else if (name.includes('male')) {
      point = this.interestPoints.filter(point => point.id === 'h8-wc-male')[0];
    } else if (name.includes('ne')) {
      point = this.interestPoints.filter(point => point.id === 'h8-stairs-ne')[0];
    } else if (name.includes('nw')) {
      point = this.interestPoints.filter(point => point.id === 'h8-stairs-nw')[0];
    } else if (name.includes('sw')) {
      point = this.interestPoints.filter(point => point.id === 'h8-stairs-sw')[0];
    } else if (name.includes('se')) {
      point = this.interestPoints.filter(point => point.id === 'h8-stairs-se')[0];
    } else if (name.includes('escalator-down')) {
      point = this.interestPoints.filter(point => point.id === 'h8-escalator-down')[0];
    } else if (name.includes('escalator-up')) {
      point = this.interestPoints.filter(point => point.id === 'h8-escalator-up')[0];
    }

    this.destID = point.id;
    this.setMarker(point);
    this.isSelectMode = this.directionManager.getIsSelectMode();
    if(this.isSelectMode){
      if(this.inputBuilding === 'hall' && this.floor === 8) {
        this.directionManager.initDifferentFloorDir(false, 'h8', this.destID, this.interestPoints)

      } else if(this.inputBuilding === 'hall' && this.floor === 9){
        this.directionManager.initDifferentFloorDir(false, 'h9', this.destID, this.interestPoints)

      }
    } else {
      if(this.inputBuilding === 'hall' && this.floor === 8) {
        this.directionManager.initiateIndoorDirections('h8', this.destID, this.interestPoints)

      } else if(this.inputBuilding === 'hall' && this.floor === 9){
        this.directionManager.initiateIndoorDirections('h9', this.destID, this.interestPoints)

      }
    }
  }

  setMarker(point: Point) {
    this.marker.setAttribute('x', point.x - 26);
    this.marker.setAttribute('y', point.y - 26);
    this.marker.style.visibility = 'visible';
  }

  public resetNav() {
    for (let line of this.path) {
      let docElement = document.getElementById(line);
      docElement.style.stroke = 'transparent';
    }
    this.foundPath = false;
    this.indoorDirectionsService.resetNav();
  }
}
