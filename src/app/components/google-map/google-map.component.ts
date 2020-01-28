import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleMaps, GoogleMap } from '@ionic-native/google-maps';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  private latitude: number = 45.4946; // to be change with geolocalisation
  private longitude: number = -73.5774;
  private height: number;
  private map: GoogleMap;
  private loading: any;

  constructor(
    private platform: Platform,

  ) {
    this.height = platform.height();
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map-canvas', {
      camera: {
        target: {
          lat: this.latitude,
          lng: this.longitude
        },
        zoom: 16,
        tilt: 30
      }
    });
  }
}
