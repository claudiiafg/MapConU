import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

//services
import { GeolocationServices } from 'src/services/geolocationServices';
import { SearchService } from 'src/services/search.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  private loc: string = '0';
  private map;
  private positionMarker;
  private height: number;
  private loading: any;
  private latitude: number = 45.4946; // to be change with geolocalisation
  private longitude: number = -73.5774;
  private deviceLatitude;
  private deviceLongitude;
  private destination: any;
  private origin: any;

  //Options to be change dynamically when user click
  walkingOptions = {
    renderOptions: {
      polylineOptions: {
        strokeColor: '#9F33FF',
        strokeOpacity: 0.6,
        strokeWeight: 5
      }
    }
  };

  transitOptions = {
    renderOptions: {
      polylineOptions: {
        strokeColor: '#4CFF33',
        strokeOpacity: 0.6,
        strokeWeight: 5
      }
    }
  };

  //To add default locations
  locations = [
    { latitude: 45.495729, longitude: -73.578041 },
    { latitude: 45.45824, longitude: -73.640452 }
  ];

  constructor(
    private platform: Platform,
    private geolocationServices: GeolocationServices,
    private searchService: SearchService
  ) {
    this.height = platform.height() - 65;
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.geolocationServices.getCurrentPosition().then(() => {
      let coordinates = this.geolocationServices.getCoordinates();
      this.deviceLatitude = coordinates.latitude;
      this.deviceLongitude = coordinates.longitude;
    });
    this.subscribeToUserInput();
  }

  public subscribeToUserInput() {
    this.searchService.origin.subscribe(resp => {
      if (Array.isArray(resp) && resp.length) {
        this.origin = { lat: resp[0], lng: resp[1] };
      }
    });
    this.searchService.destination.subscribe(resp => {
      if (Array.isArray(resp) && resp.length) {
        this.destination = { lat: resp[0], lng: resp[1] };
      }
    });
  }

  public changeCampus() {
    this.latitude = this.locations[this.loc].latitude;
    this.longitude = this.locations[this.loc].longitude;
  }
}
