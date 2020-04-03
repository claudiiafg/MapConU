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

  ngOnInit() {
    this.showLocation('bathroom');
    console.log('poi ngoninit sending initial msg');
  }


  showLocation(poi: string){
    let inputPoi :boolean;
    let pois: string[];

    //set variables for selected poi
    if(poi === 'bathroom'){
      inputPoi = this.bathroom;
      console.log('T/F value is: ', inputPoi);
      pois =['wc-female',  'wc-male'];
      }
    if(poi === 'escalator'){
      inputPoi = this.escalator;
      console.log('T/F value is: ', inputPoi);
      pois =['escalators-area',  'escalators-area-close'];
    }
    if(poi === 'stairs'){
      inputPoi = this.stairs;
      console.log('T/F value is: ', inputPoi);
      pois =['stairs-ne',  'stairs-nw', 'stairs-sw', 'stairs-se'];
    }
    if(poi === 'elevator'){
      inputPoi = this.elevators;
      console.log('T/F value is: ', inputPoi);
      pois =['elevator-area',  'elevator'];
    }

    let p: any;
    for(p in pois){
      console.log('p being sent is: ', pois[p]);
      if(inputPoi) {
        this.dataSharing.showIndoorPoi(pois[p]);
        this.checkPoi(poi);
      }
      if(!inputPoi){
        this.dataSharing.hideIndoorPoi(pois[p]);
        this.uncheckPoi(poi);
      }
    }
  }

  closePoi(){
    this.popoverController.dismiss();
  }

  checkPoi(poi: string){
    let poiToggle: any;
    poiToggle = document.getElementById(poi);
    poiToggle.style.checked = true;
  }

  uncheckPoi(poi: string){
    let poiToggle: any;
    poiToggle = document.getElementById(poi);
    poiToggle.style.checked = false;

  }

}