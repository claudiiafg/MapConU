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
      this.pois =['wc-female',  'wc-male'];
    }
    else if(poi === 'escalator'){
      this.pois =['escalators-area',  'escalators-area-close'];
    }
    else if(poi === 'stairs'){
      this.pois =['stairs-ne',  'stairs-nw', 'stairs-sw', 'stairs-se'];
    }
    else if(poi === 'elevator'){
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
      console.log('p being sent is to un-hide: ', this.pois[p]);
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