import {Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core';
import { Platform, Events } from '@ionic/angular';

//services
import { GeolocationServices } from 'src/services/geolocationServices';
import { SearchService } from 'src/services/search.service';
import { DataSharingService} from "../../../services/data-sharing.service";

var google;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})

export class GoogleMapComponent implements OnInit {
  private height: number = 0;
  private loading: any;
  private latitude: number = 45.4946; // to be change with geolocalisation
  private longitude: number = -73.5774;
  private destination: any;
  private origin: any;
  private markers: any[] = [];

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

  positionMarkerIcon = {
    url: 'assets/icon/position-marker.png',
    scaledSize: {
      width: 15,
      height: 15
    }
  };

  constructor(
    private platform: Platform,
    private geolocationServices: GeolocationServices,
    private events: Events,
    private data: DataSharingService,
    private searchService: SearchService
  ) {
    this.height = platform.height() - 65;
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.geolocationServices.getCurrentPosition();
    this.events.subscribe('coordinatesChanged', (coordinates) =>{
      let tempMarker = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }
      this.markers = [];
      this.markers.push(tempMarker);
    });
    this.data.currentMessage.subscribe(incomingMessage => {
        this.latitude = incomingMessage.latitude;
        this.longitude = incomingMessage.longitude;
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

  //use to send data to other components
  sendMessage(updatedMessage){
    this.data.updateMessage(updatedMessage);
  }
}
