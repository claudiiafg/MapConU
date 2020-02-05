import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Injectable } from '@angular/core';

@Injectable()
export class GeolocationServices {
  private latitude;
  private longitude;

  constructor(private geolocation: Geolocation) {}

  async getCurrentPosition() {
    await this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        console.log(this.latitude);
        console.log(this.longitude);
      })
      .catch(error => {
        console.log('Error getting location', error);
      });

    this.subscribeToPosition();
  }

  subscribeToPosition() {
    let watch = this.geolocation.watchPosition({ enableHighAccuracy: true });
    watch.subscribe(data => {
      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;
    });
  }

  unsuscribeToPosition() {
    navigator.geolocation.clearWatch;
  }

  getCoordinates() {
    let coordinates = {
      latitude: this.latitude,
      longitude: this.longitude
    };
    return coordinates;
  }

  getLatitude() {
    return this.latitude;
  }

  getLongitude() {
    return this.longitude;
  }
}
