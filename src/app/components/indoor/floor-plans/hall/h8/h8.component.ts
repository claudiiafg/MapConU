import { Component, OnInit } from '@angular/core';
import {
  IndoorDirectionsService,
  Line,
  Point
} from 'src/services/indoorDirections.service';
import { Events, AlertController } from '@ionic/angular';

@Component({
  selector: 'h8-floor-plan',
  templateUrl: 'h8.component.html',
  styleUrls: ['./h8.component.scss']
})
export class H8FloorPlanComponent implements OnInit {
  private pathLines: Line[] = [];
  private interestPoints: Point[] = [];
  private sourceID: string = 'entrance';
  private destID: string = 'out';
  private path: string[] = []; //path of line ids
  private foundPath: boolean = false;
  private marker: any;

  constructor(
    private indoorDirectionsService: IndoorDirectionsService,
    private events: Events,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    let docElementLines = document.getElementsByTagName('line');
    let docInterestPoints = document.getElementsByTagName('circle');
    this.marker = document.getElementById('marker');
    this.marker.style.visibility = 'hidden';

    this.indoorDirectionsService.setMap(docElementLines, docInterestPoints);
    this.pathLines = this.indoorDirectionsService.getLines();
    this.interestPoints = this.indoorDirectionsService.getPoints();

    console.log(this.pathLines);
    console.log(this.interestPoints);

    document.addEventListener('click', (res: any) => {
      let ele: string = res.toElement.id;
      if (
        ele.includes('wc') ||
        ele.includes('h8') ||
        ele.includes('elevator') ||
        ele.includes('escalator') ||
        ele.includes('stairs')
      ) {
        this.resetNav();
        this.initNav(ele);
      }
    });

    this.events.subscribe('path-found', () => {
      this.path = this.indoorDirectionsService.getPath();
      this.foundPath = true;
      for (let line of this.path) {
        let docElement = document.getElementById(line);
        docElement.style.stroke = 'blue';
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
  }

  public initNav(name: string) {
    let point: Point;

    if (name.includes('h8')) {
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
    this.showPopover();
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

  async showPopover() {
    const alert = await this.alertController.create({
      header: 'Where do you wish to know directions from?',
      cssClass: 'alert-css',
      buttons: [
        {
          text: 'From escalators',
          role: 'escalator-up'
        },
        {
          text: 'Choose source',
          role: 'choose'
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    if (result.role === 'escalator-up') {
      this.sourceID = 'h8-escalator-up';
      this.indoorDirectionsService.computePathHelper(
        this.sourceID,
        this.destID
      );
    } else if (result.role === 'choose') {
      const data = {
        destination: this.destID,
        points: this.interestPoints
      };
      this.events.publish('manually-enter-destination', data, Date.now());
    }
  }

  public setSource(pointName: string) {
    try {
      this.indoorDirectionsService.setSource(pointName);
      this.sourceID = pointName;
    } catch (e) {
      console.error(e);
    }
  }

  public setDest(pointName: string) {
    try {
      this.indoorDirectionsService.setDest(pointName);
      this.destID = pointName;
    } catch (e) {
      console.error(e);
    }
  }
}
