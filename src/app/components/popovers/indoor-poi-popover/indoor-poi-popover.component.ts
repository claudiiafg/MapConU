import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import {PopoverController} from '@ionic/angular';
import { IndoorDirectionsService } from '../../../../services/indoorDirections.service';
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
      this.fireExit = showPois[4];
      this.entrance = showPois[5];
    });

    this.dataSharing.currentBuilding.subscribe(building =>{
      this.building = building;
    });
  }

  /**
   * Method shows or hides indoor poi markers for the poi that is being toggled
   *
   * @param poi The poi that is being toggled on/off
   * @param condition Boolean to represent toggle on (true) of toggle off (false)
   */
  togglePoi(poi: string, condition: boolean){
    if(condition === undefined){
      /**
       * @hidden
       * without this empty condition hideLocation() fires and removes pois when the poi is closed
       */
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