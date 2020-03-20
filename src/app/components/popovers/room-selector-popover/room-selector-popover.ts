import { Component } from '@angular/core';
import { NavParams, Events, PopoverController } from '@ionic/angular';
import {
  Point,
  IndoorDirectionsService
} from 'src/services/indoorDirections.service';
import {TranslationService} from "../../../../services/translation.service";

@Component({
  selector: 'room-selector-popover',
  templateUrl: './room-selector-popover.html',
  styleUrls: ['./room-selector-popover.scss']
})
export class RoomSelectorPopoverComponent {
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
    public popoverController: PopoverController,
    private translate : TranslationService
  ) {
    if (this.navParams.get('data')) {
      let data = this.navParams.get('data');
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
        prettyName = this.translate.getTranslation('bathroom-w') ;
      } else if (point.id.includes('wc-male')) {
        prettyName = this.translate.getTranslation('bathroom-m');
      } else if (point.id.includes('wc')) {
        prettyName = this.translate.getTranslation('bathroom');
      } else if (point.id.includes('entrance')) {
        prettyName = this.translate.getTranslation('entrance');
      } else if (point.id.includes('down') && point.id.includes('stairs')) {
        prettyName = this.translate.getTranslation('stairs-down');
      } else if (point.id.includes('down') && point.id.includes('escalator')) {
        prettyName = this.translate.getTranslation('escalator-down');
      } else if (point.id.includes('up') && point.id.includes('escalator')) {
        prettyName = this.translate.getTranslation('escalators');
      } else if (point.id.includes('up') && point.id.includes('stairs')) {
        prettyName = this.translate.getTranslation('stairs')
      } else if (point.id.includes('ne')) {
        prettyName = this.translate.getTranslation('stairs-ne');
      } else if (point.id.includes('nw')) {
        prettyName = this.translate.getTranslation('stairs-nw');
      } else if (point.id.includes('sw')) {
        prettyName = this.translate.getTranslation('stairs-sw');
      } else if (point.id.includes('se')) {
        prettyName = this.translate.getTranslation('stairs-se');
      } else if (point.id === 'stairs') {
        prettyName = this.translate.getTranslation('stairs');
      } else if (point.id.includes('elevator')) {
        prettyName = this.translate.getTranslation('elevators');
      } else if (point.id.includes('out')) {
        prettyName = this.translate.getTranslation('exit');
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
