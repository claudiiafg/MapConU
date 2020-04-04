import {Component, Input, OnInit} from '@angular/core';
import { TranslationService} from '../../../../services/translation.service';
import { PopoverController} from '@ionic/angular';
import { IndoorDirectionsService, Point} from '../../../../services/indoorDirections.service';
import { DataSharingService } from '../../../../services/data-sharing.service';
import { IndoorPoiService } from '../../../../services/indoor-poi.service';

@Component({
  selector: 'app-indoor-poi-popover',
  templateUrl: './indoor-poi-popover.component.html',
  styleUrls: ['./indoor-poi-popover.component.scss'],
})
export class IndoorPoiPopoverComponent implements OnInit {
  building: string;
  private bathroom: boolean;
  private elevators: boolean;
  private stairs: boolean;
  private fireExtinguisher: boolean;
  private fireExit: boolean;
  private escalator: boolean;
  private entrance: boolean;

  constructor(
      private translate: TranslationService,
      private popoverController: PopoverController,
      private indoorDirectionsService: IndoorDirectionsService,
      private dataSharing: DataSharingService,
      private indoorPoi: IndoorPoiService
  ) { }

  ngOnInit() {
    let currentSelections = this.indoorPoi.getCurrentSelections()
    this.bathroom = currentSelections.bathroom;
  	this.elevators = currentSelections.elevators;
    this.stairs = currentSelections.stairs;
    this.escalator = currentSelections.escalator;
    this.fireExtinguisher = currentSelections.fireExtinguisher;
    this.fireExit = currentSelections.fireExit;
    if(this.building == 'mb1'){
      this.entrance = currentSelections.entrance;
    }
  }

  togglePoi(poi: string, condition: boolean){
    console.log('poi ', poi, ' toggled to ', condition);
    if(condition) {
      this.indoorPoi.showLocation(poi);
    }
    if(!condition) {
      this.indoorPoi.hideLocation(poi);
    }
  }

  closePoi(){
    this.popoverController.dismiss();
  }
}