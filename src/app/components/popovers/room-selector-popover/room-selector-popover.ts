import { Component } from '@angular/core';
import { NavParams, Events, PopoverController } from '@ionic/angular';
import {
  Point,
  IndoorDirectionsService
} from 'src/services/indoorDirections.service';

@Component({
  selector: 'room-selector-popover',
  templateUrl: './room-selector-popover.html',
  styleUrls: ['./room-selector-popover.scss']
})
export class RoomSelectorPopoverComponent {
  private type: string;
  private source: string;
  private destination: string;
  private prettySource: string;
  private prettyDestination: string;
  private points: Point[] = [];
  private prettyPoints: any[] = [];

  constructor(
    private navParams: NavParams,
    private indoorDirectionsService: IndoorDirectionsService,
    private events: Events,
    public popoverController: PopoverController
  ) {
    if (this.navParams.get('data')) {
      let data = this.navParams.get('data');
      this.source = data.source;
      this.destination = data.destination;
      this.points = data.points;
      this.prettifyTitles();

    } else {
      this.points = this.indoorDirectionsService.getPoints();
      this.prettifyTitles();
    }
  }

  onClickOption(name){
    console.log(name);
  }


  prettifyTitles() {
    this.prettyPoints = [];
    for (let point of this.points) {
      let prettyName: string = '';

      if (point.id.includes('wc-female')) {
        prettyName = 'Female bathrooms';
      } else if (point.id.includes('wc-male')) {
        prettyName = 'Male bathrooms';
      } else if (point.id.includes('wc')) {
        prettyName = 'Bathrooms';
      } else if (point.id.includes('entrance')) {
        prettyName = 'Entrance';
      } else if (point.id.includes('down') && point.id.includes('stairs')) {
        prettyName = 'Stairs going down';
      } else if (point.id.includes('down') && point.id.includes('escalators')) {
        prettyName = 'Escalator going down';
      } else if (point.id.includes('up') && point.id.includes('escalators')) {
        prettyName = 'Escalator going up';
      } else if (point.id.includes('up') && point.id.includes('stairs')) {
        prettyName = 'Stairs going up';
      } else if (point.id.includes('down') && point.id.includes('stairs')) {
        prettyName = 'Stairs going down';
      } else if (point.id.includes('ne')) {
        prettyName = 'North East stairs';
      } else if (point.id.includes('nw')) {
        prettyName = 'North West stairs';
      } else if (point.id.includes('sw')) {
        prettyName = 'South West stairs';
      } else if (point.id.includes('se')) {
        prettyName = 'South East stairs';
      } else if (point.id === 'stairs') {
        prettyName = 'Stairs';
      } else if (point.id.includes('elevator')) {
        prettyName = 'Elevators';
      } else if (point.id.includes('out')) {
        prettyName = 'Exit';
      } else {
        prettyName = point.id;
      }

      let tempPoint = {
        id: point.id,
        name: prettyName
      };
      this.prettyPoints.push(tempPoint);

      if (point.id === this.source) {
        this.prettySource = prettyName;
      } else if (point.id === this.destination) {
        this.prettyDestination = prettyName;
      }
    }
  }

  lookForPath() {
    this.source = this.prettyPoints.filter(
      pretty => pretty.name === this.prettySource
    )[0].id;
    this.destination = this.prettyPoints.filter(
      pretty => pretty.name === this.prettyDestination
    )[0].id;
    if (this.source && this.destination) {
      const data = {
        source: this.source,
        destination: this.destination
      };
      this.events.publish('init-new-path', data, Date.now());
      this.closePopover();
    }
  }

  async closePopover() {
    await this.popoverController.dismiss();
  }
}
