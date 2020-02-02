import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  loc: string;
  latitude: number = 45.4946; // to be change with geolocalisation
  longitude: number = -73.5774;
  height: number;

  //To add default locations
  locations = [
    { latitude: 45.495729, longitude: -73.578041 },
    { latitude: 45.458240, longitude: -73.640452 }
  ];

  constructor(platform: Platform) {
    this.height = platform.height();
  }

  ngOnInit() {}

  public changeCampus() {
    this.latitude = this.locations[this.loc].latitude;
    this.longitude = this.locations[this.loc].longitude;
  }
}
