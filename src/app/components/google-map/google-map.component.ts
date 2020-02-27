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
  previous;

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
        case 'restaurant':   this.currentToggles.restaurants = toggleValue; break;
        case 'coffee shop':  this.currentToggles.coffee = toggleValue; break;
        case 'gas station':  this.currentToggles.gas = toggleValue; break;
        case 'drugstore':    this.currentToggles.drugstore = toggleValue; break;
        case 'hotel':        this.currentToggles.hotels = toggleValue; break;
        case 'groceries':     this.currentToggles.grocery = toggleValue; break;
      }
      this.poiServices.setCurrentToggles(this.currentToggles);
      //if value is true add all markers to map (one by one to trigger HTML updates)
      if(toggleValue){
        await this.poiServices.setPOIMarkers(toggleName, this.latitude, this.longitude);
        let tempMarkers = this.poiServices.getPOIMarkers();
        this.poiMarkers = [];
        for(let marker of tempMarkers){
          this.poiMarkers.push(marker);
        }

      //if value is false remove all markers of that type from the map
      } else {
        this.currentToggles = this.poiServices.getCurrentToggles();
        let tempMarkers = this.poiServices.removePOIMarkers(toggleName);
        this.poiMarkers = [];
        for(let marker of tempMarkers){
          this.poiMarkers.push(marker);
        }
      }
    });

    //as a toggle is clicke, update the current toggles
    this.events.subscribe('poi-clicked', () => {
      this.events.publish('set-poi-toggles', this.currentToggles ,Date.now());
    });

    this.events.subscribe('campusChanged', () => {
      this.poiMarkers = [];
      this.currentToggles = this.poiServices.resetPOIMarkers();
    });
  }

  //show name of POI when clicked on a marker
  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
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
