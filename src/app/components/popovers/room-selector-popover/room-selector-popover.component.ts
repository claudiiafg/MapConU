import { Component } from '@angular/core';
import { NavParams, Events, PopoverController } from '@ionic/angular';
import {
  Point,
  IndoorDirectionsService
} from 'src/services/indoorDirections.service';
import { StringHelperService } from 'src/services/stringHelper.service';
import { TranslationService } from 'src/services/translation.service';

@Component({
  selector: 'room-selector-popover',
  templateUrl: './room-selector-popover.component.html',
  styleUrls: ['./room-selector-popover.component.scss']
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
    private indoorDirectionsService: IndoorDirectionsService,
    private events: Events,
    public popoverController: PopoverController,
    private stringHelper: StringHelperService,
    private translate: TranslationService,
    private navParams: NavParams
  ) {}

  ngOnInit(){
    if (this.navParams.get('data')) {
      const data = this.navParams.get('data');
      this.source = data.source;
      this.destination = data.destination;
    }
    this.points = this.indoorDirectionsService.getPoints();
    this.prettifyTitles();
  }

  prettifyTitles() {
    this.prettyPoints = [];
    for (let point of this.points) {
      let prettyName: string = this.stringHelper.prettifyTitles(point.id);
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
    this.events.publish('close-indoor-popup');
    await this.popoverController.dismiss(true);
  }
}
