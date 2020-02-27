import { Injectable } from '@angular/core';
import { GeolocationServices } from './geolocationServices';

@Injectable()
export class PoiServices {
  private poiMarkers: any[] = [];
  private currentToggles : any = {
    restaurants : false,
    coffee : false,
    gas: false,
    drugstore : false,
    hotels : false,
    grocery : false,
  }

  constructor(
    private geolocationServices: GeolocationServices,
  ) {}

  setPOIMarkers(type: string, lat: number, lng: number){
    //important so it doesn't break our map (if use ours, it tries to render it again)
    let tempMap = <HTMLDivElement>document.getElementById('tempMap');
    var location = new google.maps.LatLng(lat, lng);
    let service = new google.maps.places.PlacesService(tempMap);
    let self = this;
    return new Promise( function( resolve, reject ) {
      service.nearbySearch({
        location: location,
        radius: 100,
        keyword: type
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if(!self.hasType(type)){
            console.log(results);
            for(let place of results){
              let tempPlace = {
                latitude: place.geometry.location.lat().toString(),
                longitude: place.geometry.location.lng().toString(),
                data: place,
                type: type
              }
              self.poiMarkers.push(tempPlace);
            }
            resolve(self.poiMarkers);
          }
        } else {
          console.error(status);
        }
      });
    });
  }

  getPOIMarkers(){
    return this.poiMarkers;
  }

  hasType(type : string){
    for(let marker of this.poiMarkers){
      if(marker.type === type){
        return true;
      }
    }
    return false;
  }

  removePOIMarkers(type : string) : any{
    let tempPOIMarkers: any[] = [];
    for(let marker of this.poiMarkers){
      if(marker.type !== type){
        tempPOIMarkers.push(marker);
      }
    }
    this.poiMarkers = tempPOIMarkers;
    return this.poiMarkers;
  }

  setCurrentToggles(currentToggles){
    this.currentToggles = currentToggles;
  }

  getCurrentToggles() : any{
    return this.currentToggles;
  }

  resetPOIMarkers(){
    this.currentToggles = {
      restaurants : false,
      coffee : false,
      gas: false,
      drugstore : false,
      hotels : false,
      grocery : false,
    }
    return this.currentToggles;
  }
}
