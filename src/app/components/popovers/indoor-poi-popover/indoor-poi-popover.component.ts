import {Component, Input, OnInit} from '@angular/core';
import { TranslationService} from '../../../../services/translation.service';
import { PopoverController} from '@ionic/angular';
import { IndoorDirectionsService, Point} from '../../../../services/indoorDirections.service';
import { DataSharingService } from '../../../../services/data-sharing.service';

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
      private dataSharing: DataSharingService
  ) { }

  ngOnInit() {}

  showLocation(poi: string){
    if(poi === 'bathroom'){
      let pois: string[] =['wc-female',  'wc-male'];
      let p: string;
      for(p in pois){
        if(this.bathroom) {
          this.dataSharing.showIndoorPoi(pois[p]);
        }
        if(!this.bathroom){
          this.dataSharing.hideIndoorPoi(pois[p]);
        }
      }
    }
    if(poi === 'escalator'){
      let pois: string[] =['escalators-area',  'escalators-area-close'];
      let p: string;
      for(p in pois){
        this.dataSharing.showIndoorPoi(pois[p]);
      }
    }
    if(poi === 'stairs'){
      let pois: string[] =['stairs-ne',  'stairs-nw', 'stairs-sw', 'stairs-se'];
      let p: string;
      for(p in pois){
        this.dataSharing.showIndoorPoi(pois[p]);
      }
    }
    if(poi === 'elevator'){
      let pois: string[] =['elevator-area',  'elevator'];
      let p: string;
      for(p in pois){
        this.dataSharing.showIndoorPoi(pois[p]);
      }
    }
  }

  closePoi(){
    this.popoverController.dismiss();
  }

}