import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

@Injectable()
export class GeolocationServices {
  private latitude;
  private longitude;


  constructor(
    private geolocation: Geolocation,
    private events: Events,
  ) {}


  async getCurrentPosition(){
    await this.geolocation.getCurrentPosition().then( (resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.subscribeToPosition();
  }

  subscribeToPosition(){
    let watch = this.geolocation.watchPosition({ maximumAge: 1000, enableHighAccuracy: true });
    watch.subscribe((data) => {
      if(data){
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;
        let coordinates = {
          latitude: this.latitude,
          longitude: this.longitude
        }
        this.events.publish('coordinatesChanged', coordinates);
      }
    });
  }

  unsuscribeToPosition(){
    navigator.geolocation.clearWatch;
  }

  getCoordinates(){
    let coordinates = {
      latitude: this.latitude,
      longitude: this.longitude
    }
    return coordinates;
  }

  getLatitude(){
    return this.latitude;
  }

  getLongitude(){
    return this.longitude;
  }

}
