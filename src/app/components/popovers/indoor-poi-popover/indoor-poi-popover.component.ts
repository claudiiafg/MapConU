import { Component, Input, OnInit } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import {PopoverController} from '@ionic/angular';
import { IndoorDirectionsService, Point } from '../../../../services/indoorDirections.service';
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
      private indoorPoi: IndoorPoiService,
  ) {}

  ngOnInit() {
    this.dataSharing.toggleStatus.subscribe( showPois =>{
      this.bathroom = showPois[0];
      this.elevators = showPois[1];
      this.stairs = showPois[2];
      this.escalator = showPois[3];
      this.fireExtinguisher = showPois[4];
      this.fireExit = showPois[5];
      this.entrance = showPois[6];
    });

    this.dataSharing.currentBuilding.subscribe(building =>{
      this.building = building;
    });
  }

  togglePoi(poi: string, condition: boolean){
    console.log('poi ', poi, ' toggled to ', condition);
    if(condition === undefined){
      //without this empty condition hideLocation() fires and removes pois when the poi is closed
    }
    else if(condition) {
      this.indoorPoi.showLocation(poi);
    }
    else if(!condition) {
      this.indoorPoi.hideLocation(poi);
    }
  }

  closePoi(){
    this.dataSharing.updateIndoorPoiToggles(false);
    this.popoverController.dismiss();
  }
}