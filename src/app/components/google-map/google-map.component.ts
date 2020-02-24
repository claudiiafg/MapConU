import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import {Platform, Events} from '@ionic/angular';

//services
import {GeolocationServices} from 'src/services/geolocationServices';
import {SearchService} from 'src/services/search.service';
import {DataSharingService} from '../../../services/data-sharing.service';

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
  concordiaRed = '#800000';
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

  //coordinates for concordia building overlays
  hallCoords = [
    {lat: 45.496836, lng: -73.578858},
    {lat: 45.497164, lng: -73.579539},
    {lat: 45.497720, lng: -73.579029},
    {lat: 45.497385, lng: -73.578348}
  ];

  jmsbCoords = [
    {lat: 45.495531, lng: -73.579197},
    {lat: 45.495357, lng: -73.579378},
    {lat: 45.495222, lng: -73.579117},
    {lat: 45.495165, lng: -73.579174},
    {lat: 45.495008, lng: -73.578808},
    {lat: 45.495040, lng: -73.578780},
    {lat: 45.495007, lng: -73.578725},
    {lat: 45.495209, lng: -73.578507}
  ];

  lbCoords = [
    {lat: 45.497285, lng: -73.578091},
    {lat: 45.496681, lng: -73.578678},
    {lat: 45.496249, lng: -73.577721},
    {lat: 45.496497, lng: -73.577474},
    {lat: 45.496544, lng: -73.577608},
    {lat: 45.496894, lng: -73.577268}
  ];

  fgCoords = [
    {lat: 45.494367, lng: -73.578440},
    {lat: 45.494190, lng: -73.577981},
    {lat: 45.494480, lng: -73.577654},
    {lat: 45.494702, lng: -73.578037}
  ];

  fbCoords = [
    {lat: 45.494922, lng: -73.577777},
    {lat: 45.494653, lng: -73.577217},
    {lat: 45.494395, lng: -73.577517},
    {lat: 45.494702, lng: -73.578037}
  ];

  evCoords = [
    {lat: 45.495960, lng: -73.578493},
    {lat: 45.495487, lng: -73.577579},
    {lat: 45.495199, lng: -73.577901},
    {lat: 45.495611, lng: -73.578802}
  ];

  gnCoords = [
    {lat: 45.493338, lng: -73.576621},
    {lat: 45.493781, lng: -73.577758},
    {lat: 45.494406, lng: -73.577115},
    {lat: 45.494026, lng: -73.576289},
    {lat: 45.494127, lng: -73.576176},
    {lat: 45.494026, lng: -73.575993},
    {lat: 45.493932, lng: -73.576090},
    {lat: 45.493714, lng: -73.575639},
    {lat: 45.493571, lng: -73.575784},
    {lat: 45.493770, lng: -73.576197}
  ];

  adCoords = [
    {lat: 45.457922, lng: -73.640125},
    {lat: 45.457998, lng: -73.640067},
    {lat: 45.457975, lng: -73.640007},
    {lat: 45.458281, lng: -73.639775},
    {lat: 45.458299, lng: -73.639826},
    {lat: 45.458384, lng: -73.639766},
    {lat: 45.458268, lng: -73.639468},
    {lat: 45.458172, lng: -73.639528},
    {lat: 45.458207, lng: -73.639618},
    {lat: 45.457912, lng: -73.639848},
    {lat: 45.457875, lng: -73.639775},
    {lat: 45.457803, lng: -73.639829}

  ];

  ccCoords = [
    {lat: 45.458079, lng: -73.640012},
    {lat: 45.458366, lng: -73.640796},
    {lat: 45.458534, lng: -73.640678},
    {lat: 45.458240, lng: -73.639897}
  ];

  spCoords = [
    {lat: 45.457213, lng: -73.640656},
    {lat: 45.457527, lng: -73.641469},
    {lat: 45.458167, lng: -73.640975},
    {lat: 45.458329, lng: -73.641415},
    {lat: 45.457469, lng: -73.642075},
    {lat: 45.456982, lng: -73.640833}
  ];

  cjCoords = [
    {lat: 45.457217, lng: -73.640015},
    {lat: 45.457362, lng: -73.640074},
    {lat: 45.457409, lng: -73.640203},
    {lat: 45.457177, lng: -73.640393},
    {lat: 45.457311, lng: -73.640734},
    {lat: 45.457597, lng: -73.640501},
    {lat: 45.457650, lng: -73.640632},
    {lat: 45.457828, lng: -73.640479},
    {lat: 45.457652, lng: -73.640021},
    {lat: 45.457495, lng: -73.640144},
    {lat: 45.457439, lng: -73.640026},
    {lat: 45.457469, lng: -73.639809},
    {lat: 45.457388, lng: -73.639758},
    {lat: 45.457285, lng: -73.639795},
    {lat: 45.457226, lng: -73.639905}
  ];

  vlCoords = [
    {lat: 45.458869, lng: -73.638234},
    {lat: 45.458617, lng: -73.638422},
    {lat: 45.458848, lng: -73.639028},
    {lat: 45.458938, lng: -73.638961},
    {lat: 45.459123, lng: -73.639460},
    {lat: 45.459493, lng: -73.639133},
    {lat: 45.459140, lng: -73.638191},
    {lat: 45.459222, lng: -73.638127},
    {lat: 45.459108, lng: -73.637843},
    {lat: 45.458807, lng: -73.638068}
  ];

  pyCoords = [
    {lat: 45.459238, lng: -73.640544},
    {lat: 45.459083, lng: -73.640149},
    {lat: 45.458720, lng: -73.640426},
    {lat: 45.458857, lng: -73.640839}
  ];

  fcCoords = [
    {lat: 45.458370, lng: -73.639044},
    {lat: 45.458551, lng: -73.639624},
    {lat: 45.458743, lng: -73.639479},
    {lat: 45.458536, lng: -73.638923}
  ];


  constructor(
      private platform: Platform,
      private geolocationServices: GeolocationServices,
      private events: Events,
      private data: DataSharingService,
      private searchService: SearchService
  ) {
    this.height = platform.height() - 106;
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.geolocationServices.getCurrentPosition();
    this.events.subscribe('coordinatesChanged', coordinates => {
      let tempMarker = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      };
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
  sendMessage(updatedMessage) {
    this.data.updateMessage(updatedMessage);
  }
}
