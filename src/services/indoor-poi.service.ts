import { Injectable } from '@angular/core';
import { DataSharingService } from './data-sharing.service';

@Injectable({
providedIn: 'root'
})
export class IndoorPoiService {
  private pois: string[];

constructor(
      private dataSharing: DataSharingService
  ) { }


  /**
   * Sets the marker names for selected poi
   *
   * @param poi the poi for which to show or hide markers
   */
  setConditions(poi: string){
    if(poi === 'bathroom'){
      this.pois =['wc-female',  'wc-male'];
    }
    else if(poi === 'escalator'){
      this.pois =['escalator-up', 'escalator-down', 'escalator'];
    }
    else if(poi === 'stairs'){
      this.pois =['stairs-ne',  'stairs-nw', 'stairs-sw', 'stairs-se'];
    }
    else if(poi === 'elevators'){
      this.pois =['elevator'];
    }
    else if(poi === 'fireExit'){
      this.pois = ['exit1', 'exit2', 'exit3', 'exit4'];
    }
    else if(poi === 'entrance'){
      this.pois = ['entrance'];
    }
    else{
      console.log(poi, 'not an accepted poi');
    }

  }

  /**
   * Makes markers visible for all points under the category of the poi parameter passed
   * @param poi The poi to show
   */
  showLocation(poi: string){
    this.setConditions(poi);
    let p: any;
    for(p in this.pois){
        this.dataSharing.showIndoorPoi([this.pois[p], true]);
      }
  }

  /**
  * Makes markers hidden for all points under the category of the poi parameter passed
  * @param poi The poi to hide
  */
  hideLocation(poi: string) {
    this.setConditions(poi);
    let p: any;
    for (p in this.pois) {
      this.dataSharing.hideIndoorPoi([this.pois[p], false]);
    }
  }

}