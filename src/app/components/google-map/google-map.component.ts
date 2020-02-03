import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

//services
import { GeolocationServices } from 'src/services/geolocationServices';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  private latitude: number = 45.4946; // to be change with geolocalisation
  private longitude: number = -73.5774;
  private height: number;
  private loading: any;

  constructor(
    private platform: Platform,
    private geolocationServices: GeolocationServices,

  ) {
    this.height = platform.height();
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.geolocationServices.getCurrentPosition().then(() => {
      console.log(this.geolocationServices.getCoordinates());

    });
  }
}
