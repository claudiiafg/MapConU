import { Injectable } from '@angular/core';
import { GeolocationServices } from './geolocationServices';

@Injectable()
export class PoiServices {
  private poiMarkers: any[] = [];
  private currentToggles = {
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

  getPOIMarkers(type: string){
    //important so it doesn't break our map (if use ours, it tries to render it again)
    let tempMap = <HTMLDivElement>document.getElementById('tempMap');
    let service = new google.maps.places.PlacesService(tempMap);
    service.nearbySearch({
      location: {
        lat: this.geolocationServices.getLatitude(),
        lng: this.geolocationServices.getLongitude()
      },
      radius: 100,
      type: type
    }, (results,status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for(let place of results){
          let tempPlace = {
            latitude: place.geometry.location.lat().toString(),
            longitude: place.geometry.location.lng().toString(),
            type: type
          }
          this.poiMarkers.push(tempPlace);
        }
        return this.poiMarkers;
      }
    });
  }

  removePOIMarkers(type : string){
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

  getCurrentToggles(){
    return this.currentToggles;
  }
}
