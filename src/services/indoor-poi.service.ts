import { Injectable } from '@angular/core';
import { DataSharingService } from './data-sharing.service';

@Injectable({
providedIn: 'root'
})
export class IndoorPoiService {
  private pois: string[];
  private currentSelections: any = {
    bathroom: false,
    elevators: false,
    stairs: false,
    fireExtinguisher: false,
    fireExit: false,
    escalator: false,
    entrance: false,
  };

constructor(
      private dataSharing: DataSharingService
  ) { }

  getCurrentSelections(){
    return this.currentSelections;
  }

  //set variables for selected poi
  setConditions(poi: string){
    if(poi === 'bathroom'){
      if(this.currentSelections.bathroom){
        this.currentSelections.bathroom = true;
      }
      else{
        this.currentSelections.bathroom = false;
      }
      this.pois =['wc-female',  'wc-male'];
    }
    else if(poi === 'escalator'){
      if(this.currentSelections.escalator){
        this.currentSelections.escalator = true;
      }
      else{
        this.currentSelections.escalator = false;
      }      this.pois =['escalators-area'];
    }
    else if(poi === 'stairs'){
      if(this.currentSelections.stairs){
        this.currentSelections.stairs = true;
      }
      else{
        this.currentSelections.stairs = false;
      }
      this.pois =['stairs-ne',  'stairs-nw', 'stairs-sw', 'stairs-se'];
    }
    else if(poi === 'elevators'){
      if(this.currentSelections.elevators){
        this.currentSelections.elevators = true;
      }
      else{
        this.currentSelections.elevators = false;
      }
      this.pois =['elevator-area',  'elevator'];
    }
    else{
      console.log(poi, 'not an accepted poi');
    }

  }
  showLocation(poi: string){
    this.setConditions(poi);
    let p: any;
    for(p in this.pois){
        this.dataSharing.showIndoorPoi(this.pois[p]);
      }
  }

  hideLocation(poi: string) {
    this.setConditions(poi);
    let p: any;
    for (p in this.pois) {
      console.log('p being sent to hide is: ', this.pois[p]);
      this.dataSharing.hideIndoorPoi(this.pois[p]);
    }
  }

}