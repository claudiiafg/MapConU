import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  latitude: number = 45.4946; // to be change with geolocalisation
  longitude: number = -73.5774;
  height: number;

  constructor(platform: Platform) {
    this.height = platform.height();
  }

  ngOnInit() {}
}
