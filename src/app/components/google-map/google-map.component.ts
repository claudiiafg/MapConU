import { Component, OnInit } from '@angular/core';
import { Platform, Events } from '@ionic/angular';

//services
import { GeolocationServices } from 'src/services/geolocationServices';
import { SearchService } from 'src/services/search.service';
import { DataSharingService } from '../../../services/data-sharing.service';
import { PoiServices } from 'src/services/poiServices';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  private height: number;
  private latitude: number;
  private longitude: number;
  private destination: any;
  private origin: any;
  private positionMarkers: any[] = [];
  private poiMarkers: any[] = [];
  private currentToggles : any = {
    restaurants : false,
    coffee : false,
    gas: false,
    drugstore : false,
    hotels : false,
    grocery : false,
  }

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

  poiMarkerIcon = {
    url: 'assets/icon/poi-marker.png',
    scaledSize: {
      width: 20,
      height: 20
    }
  };

  constructor(
    private platform: Platform,
    private geolocationServices: GeolocationServices,
    private events: Events,
    private data: DataSharingService,
    private searchService: SearchService,
    private poiServices : PoiServices,
  ) {
    this.height = platform.height() - 106;
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.geolocationServices.getCurrentPosition();

    //subscribe to changes in current position
    this.events.subscribe('coordinatesChanged', coordinates => {
      let tempMarker = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      };
      this.latitude = coordinates.latitude;
      this.longitude = coordinates.longitude;
      this.positionMarkers = [];
      this.positionMarkers.push(tempMarker);
    });

    this.data.currentMessage.subscribe(incomingMessage => {
      this.latitude = incomingMessage.latitude;
      this.longitude = incomingMessage.longitude;
    });

    this.subscribeToUserInput();

    //subscribe to changes in POI toggles
    this.events.subscribe('poi-toggle-changed', async (res) => {
      const toggleName = res.toggle;
      const toggleValue = res.value;
      console.log(toggleName + ': ' + toggleValue);
      switch(toggleName){
        case 'restaurants':   this.currentToggles.restaurants = toggleValue;
        case 'coffee shops':  this.currentToggles.coffee = toggleValue;
        case 'gas stations':  this.currentToggles.gas = toggleValue;
        case 'drugstores':    this.currentToggles.drugstore = toggleValue;
        case 'hotels':        this.currentToggles.hotels = toggleValue;
        case 'groceries':     this.currentToggles.grocery = toggleValue;
      }
      this.poiServices.setCurrentToggles(this.currentToggles);
      if(toggleValue){
        this.currentToggles = await this.poiServices.getPOIMarkers(toggleName);
        console.log(this.currentToggles);
      } else {
        this.currentToggles = this.poiServices.removePOIMarkers(toggleName);
      }
    });

    this.events.subscribe('poi-clicked', () => {
      this.events.publish('set-poi-toggles', this.currentToggles ,Date.now());
    });

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
  sendMessage(updatedMessage : string) {
    this.data.updateMessage(updatedMessage);
  }
}
