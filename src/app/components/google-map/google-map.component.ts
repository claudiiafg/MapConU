import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  Events,
  NavController,
  Platform
} from '@ionic/angular';
import { DirectionService } from 'src/services/direction.service';
//services
import { GeolocationServices } from 'src/services/geolocationServices';
import { PoiServices } from 'src/services/poiServices';
import { DataSharingService } from '../../../services/data-sharing.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  public height: number = 0;
  public latitude: number = 45.495729;
  public longitude: number = -73.578041;
  public destination: any;
  public origin: any;
  public concordiaRed = '#800000';
  public positionMarkers: any[] = [];
  public poiMarkers: any[] = [];
  public travelMode = 'walk';
  public previous: any;
  public currentToggles: any = {
    restaurants: false,
    coffee: false,
    gas: false,
    drugstore: false,
    hotels: false,
    grocery: false
  };
  private buildingToNavigateTo: string;

  public provideRouteAlternatives: boolean = true;

  // Options to be change dynamically when user click
  polylineOptions = {
    renderOptions: {
      polylineOptions: {
        strokeColor: '#339fff',
        strokeOpacity: 0.6,
        strokeWeight: 5
      }
    }
  };

  // Marker
  positionMarkerIcon = {
    url: 'assets/icon/position-marker.png',
    scaledSize: {
      width: 15,
      height: 15
    }
  };

  // TODO: Move coordinates to json file, import json object and set coordinates here.

  hallCoords = [
    { lat: 45.496836, lng: -73.578858 },
    { lat: 45.497164, lng: -73.579539 },
    { lat: 45.49772, lng: -73.579029 },
    { lat: 45.497385, lng: -73.578348 }
  ];

  jmsbCoords = [
    { lat: 45.495531, lng: -73.579197 },
    { lat: 45.495357, lng: -73.579378 },
    { lat: 45.495222, lng: -73.579117 },
    { lat: 45.495165, lng: -73.579174 },
    { lat: 45.495008, lng: -73.578808 },
    { lat: 45.49504, lng: -73.57878 },
    { lat: 45.495007, lng: -73.578725 },
    { lat: 45.495209, lng: -73.578507 }
  ];

  lbCoords = [
    { lat: 45.497285, lng: -73.578091 },
    { lat: 45.496681, lng: -73.578678 },
    { lat: 45.496249, lng: -73.577721 },
    { lat: 45.496497, lng: -73.577474 },
    { lat: 45.496544, lng: -73.577608 },
    { lat: 45.496894, lng: -73.577268 }
  ];

  fgCoords = [
    { lat: 45.494367, lng: -73.57844 },
    { lat: 45.49419, lng: -73.577981 },
    { lat: 45.49448, lng: -73.577654 },
    { lat: 45.494702, lng: -73.578037 }
  ];

  fbCoords = [
    { lat: 45.494922, lng: -73.577777 },
    { lat: 45.494653, lng: -73.577217 },
    { lat: 45.494395, lng: -73.577517 },
    { lat: 45.494702, lng: -73.578037 }
  ];

  evCoords = [
    { lat: 45.496057, lng: -73.577718 },
    { lat: 45.495793, lng: -73.577176 },
    { lat: 45.495143, lng: -73.577821 },
    { lat: 45.495596, lng: -73.578766 },
    { lat: 45.495945, lng: -73.578428 },
    { lat: 45.495736, lng: -73.578031 }
  ];

  gmCoords = [
    { lat: 45.495596, lng: -73.578766 },
    { lat: 45.495945, lng: -73.578428 },
    { lat: 45.496125, lng: -73.578814 },
    { lat: 45.495774, lng: -73.579154 }
  ];

  gnCoords = [
    { lat: 45.493338, lng: -73.576621 },
    { lat: 45.493781, lng: -73.577758 },
    { lat: 45.494406, lng: -73.577115 },
    { lat: 45.494026, lng: -73.576289 },
    { lat: 45.494127, lng: -73.576176 },
    { lat: 45.494026, lng: -73.575993 },
    { lat: 45.493932, lng: -73.57609 },
    { lat: 45.493714, lng: -73.575639 },
    { lat: 45.493571, lng: -73.575784 },
    { lat: 45.49377, lng: -73.576197 }
  ];

  annexCoords = [
    { lat: 45.496721, lng: -73.579157 },
    { lat: 45.497092, lng: -73.579916 },
    { lat: 45.496944, lng: -73.580066 },
    { lat: 45.496563, lng: -73.579303 }
  ];

  tdCoords = [
    { lat: 45.494734, lng: -73.578952 },
    { lat: 45.494861, lng: -73.578799 },
    { lat: 45.494656, lng: -73.57845 },
    { lat: 45.49454, lng: -73.57861 }
  ];

  vaCoords = [
    { lat: 45.495392, lng: -73.573756 },
    { lat: 45.495673, lng: -73.574319 },
    { lat: 45.496193, lng: -73.573784 },
    { lat: 45.496073, lng: -73.573539 },
    { lat: 45.49582, lng: -73.573805 },
    { lat: 45.495664, lng: -73.573488 }
  ];

  adCoords = [
    { lat: 45.457922, lng: -73.640125 },
    { lat: 45.457998, lng: -73.640067 },
    { lat: 45.457975, lng: -73.640007 },
    { lat: 45.458281, lng: -73.639775 },
    { lat: 45.458299, lng: -73.639826 },
    { lat: 45.458384, lng: -73.639766 },
    { lat: 45.458268, lng: -73.639468 },
    { lat: 45.458172, lng: -73.639528 },
    { lat: 45.458207, lng: -73.639618 },
    { lat: 45.457912, lng: -73.639848 },
    { lat: 45.457875, lng: -73.639775 },
    { lat: 45.457803, lng: -73.639829 }
  ];

  ccCoords = [
    { lat: 45.458079, lng: -73.640012 },
    { lat: 45.458366, lng: -73.640796 },
    { lat: 45.458534, lng: -73.640678 },
    { lat: 45.45824, lng: -73.639897 }
  ];

  spCoords = [
    { lat: 45.457213, lng: -73.640656 },
    { lat: 45.457527, lng: -73.641469 },
    { lat: 45.458167, lng: -73.640975 },
    { lat: 45.458329, lng: -73.641415 },
    { lat: 45.457469, lng: -73.642075 },
    { lat: 45.456982, lng: -73.640833 }
  ];

  cjCoords = [
    { lat: 45.457217, lng: -73.640015 },
    { lat: 45.457362, lng: -73.640074 },
    { lat: 45.457409, lng: -73.640203 },
    { lat: 45.457177, lng: -73.640393 },
    { lat: 45.457311, lng: -73.640734 },
    { lat: 45.457597, lng: -73.640501 },
    { lat: 45.45765, lng: -73.640632 },
    { lat: 45.457828, lng: -73.640479 },
    { lat: 45.457652, lng: -73.640021 },
    { lat: 45.457495, lng: -73.640144 },
    { lat: 45.457439, lng: -73.640026 },
    { lat: 45.457469, lng: -73.639809 },
    { lat: 45.457388, lng: -73.639758 },
    { lat: 45.457285, lng: -73.639795 },
    { lat: 45.457226, lng: -73.639905 }
  ];

  vlCoords = [
    { lat: 45.458869, lng: -73.638234 },
    { lat: 45.458617, lng: -73.638422 },
    { lat: 45.458848, lng: -73.639028 },
    { lat: 45.459047, lng: -73.638862 },
    { lat: 45.459094, lng: -73.638961 },
    { lat: 45.459199, lng: -73.638881 },
    { lat: 45.459161, lng: -73.638779 },
    { lat: 45.459311, lng: -73.638658 },
    { lat: 45.45914, lng: -73.638191 },
    { lat: 45.459222, lng: -73.638127 },
    { lat: 45.459108, lng: -73.637843 },
    { lat: 45.458807, lng: -73.638068 }
  ];

  ptCoords = [
    { lat: 45.459161, lng: -73.638779 },
    { lat: 45.459311, lng: -73.638658 },
    { lat: 45.459493, lng: -73.639133 },
    { lat: 45.459347, lng: -73.639245 }
  ];

  scCoords = [
    { lat: 45.458964, lng: -73.639054 },
    { lat: 45.459123, lng: -73.63946 },
    { lat: 45.459347, lng: -73.639245 },
    { lat: 45.459199, lng: -73.638881 }
  ];

  pyCoords = [
    { lat: 45.459238, lng: -73.640544 },
    { lat: 45.459083, lng: -73.640149 },
    { lat: 45.45872, lng: -73.640426 },
    { lat: 45.458857, lng: -73.640839 }
  ];

  raCoords = [
    { lat: 45.456378, lng: -73.637352 },
    { lat: 45.456726, lng: -73.637086 },
    { lat: 45.457195, lng: -73.638339 },
    { lat: 45.456872, lng: -73.63862 }
  ];

  haCoords = [
    { lat: 45.458924, lng: -73.641813 },
    { lat: 45.459277, lng: -73.641558 },
    { lat: 45.459127, lng: -73.641165 },
    { lat: 45.459517, lng: -73.640872 },
    { lat: 45.459906, lng: -73.642033 },
    { lat: 45.459631, lng: -73.642295 },
    { lat: 45.459526, lng: -73.642027 },
    { lat: 45.459118, lng: -73.642342 }
  ];

  fcCoords = [
    { lat: 45.45837, lng: -73.639044 },
    { lat: 45.458551, lng: -73.639624 },
    { lat: 45.458743, lng: -73.639479 },
    { lat: 45.458536, lng: -73.638923 }
  ];

  public overlayCoords = [
    {
      name: 'Hall Building',
      address: '1455 De Maisonneeuve Blvd. W.',
      coords: this.hallCoords
    },
    {
      name: 'John Molson Building',
      address: '1450 Guy St.',
      coords: this.jmsbCoords
    },
    {
      name: 'JW McConnell Building',
      address: '1400 De Maisonneeuve Blvd. W.',
      coords: this.lbCoords
    },
    {
      name: 'Faubourg Building',
      address: '1250 Guy St.',
      coords: this.fbCoords
    },
    { name: 'Faubourg Ste Catherine Building', coords: this.fgCoords },
    {
      name: 'EV Building',
      address: '1515 St. Catherine W.',
      coords: this.evCoords
    },
    {
      name: 'Guy-De Maisonneuve Building',
      address: '1550 De Maisonneeuve Blvd. W.',
      coords: this.gmCoords
    },
    { name: 'Grey Nuns', address: '1190 Guy St.', coords: this.gnCoords },
    {
      name: 'Concordia Annexes',
      address: '2010-2110 Mackay St.',
      coords: this.annexCoords
    },
    { name: 'TD Building', address: '1410 Guy St.', coords: this.tdCoords },
    {
      name: 'Visual Arts Building',
      address: '1395 Rene Levsque Blvd. W.',
      coords: this.vaCoords
    },
    {
      name: 'Administration Building',
      address: '7141 Sherbrooke W.',
      coords: this.adCoords
    },
    {
      name: 'Central Building',
      address: '7141 Sherbrooke W.',
      coords: this.ccCoords
    },
    {
      name: 'Richard J. Renaud Science Complex',
      address: '7141 Sherbrooke W.',
      coords: this.spCoords
    },
    {
      name: 'Communication Studies and Journalism Building',
      address: '7141 Sherbrooke W.',
      coords: this.cjCoords
    },
    {
      name: 'Vanier Library',
      address: '7141 Sherbrooke W.',
      coords: this.vlCoords
    },
    {
      name: 'Oscar Peterson Concert Hall',
      address: '7141 Sherbrooke W.',
      coords: this.ptCoords
    },
    {
      name: 'Student Center',
      address: '7141 Sherbrooke W.',
      coords: this.scCoords
    },
    {
      name: 'Psychology Building',
      address: '7141 Sherbrooke W.',
      coords: this.pyCoords
    },
    {
      name: 'Recreation and Athletics Complex',
      address: '7200 Sherbrooke W.',
      coords: this.raCoords
    },
    {
      name: 'Hingston Hall',
      address: '7141 Sherbrooke W.',
      coords: this.haCoords
    },
    {
      name: 'FC Smith Building',
      address: '7141 Sherbrooke W.',
      coords: this.fcCoords
    }
  ];

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
    private directionService: DirectionService,
    private poiServices: PoiServices,
    private alertController: AlertController,
    private navController: NavController,
    private router: Router,
    private dataSharingService: DataSharingService
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.geolocationServices.getCurrentPosition();

    this.subscribeToMapSize();
    this.subscribeToTravelMode();
    this.subscribeToChangeInCurrentPOS();
    this.subscribeToChangeInPOI();
  }

  public subscribeToChangeInPOI() {
    //subscribe to changes in POI toggles
    this.events.subscribe('poi-toggle-changed', async res => {
      const toggleName = res.toggle;
      const toggleValue = res.value;
      switch (toggleName) {
        case 'restaurant':
          this.currentToggles.restaurants = toggleValue;
          break;
        case 'coffee shop':
          this.currentToggles.coffee = toggleValue;
          break;
        case 'gas station':
          this.currentToggles.gas = toggleValue;
          break;
        case 'drugstore':
          this.currentToggles.drugstore = toggleValue;
          break;
        case 'hotel':
          this.currentToggles.hotels = toggleValue;
          break;
        case 'groceries':
          this.currentToggles.grocery = toggleValue;
          break;
      }
      this.poiServices.setCurrentToggles(this.currentToggles);
      //if value is true add all markers to map (one by one to trigger HTML updates)
      if (toggleValue) {
        if (!this.latitude && !this.longitude) {
          this.latitude = 45.495729;
          this.longitude = -73.578041;
        }
        await this.poiServices.setPOIMarkers(
          toggleName,
          this.latitude,
          this.longitude
        );
        let tempMarkers = this.poiServices.getPOIMarkers();
        this.poiMarkers = [];
        for (let marker of tempMarkers) {
          this.poiMarkers.push(marker);
        }

        //if value is false remove all markers of that type from the map
      } else {
        this.currentToggles = this.poiServices.getCurrentToggles();
        let tempMarkers = this.poiServices.removePOIMarkers(toggleName);
        this.poiMarkers = [];
        for (let marker of tempMarkers) {
          this.poiMarkers.push(marker);
        }
      }
    });

    //as a toggle is clicke, update the current toggles
    this.events.subscribe('poi-clicked', () => {
      this.events.publish('set-poi-toggles', this.currentToggles, Date.now());
    });
    this.events.subscribe('campusChanged', () => {
      this.poiMarkers = [];
      this.currentToggles = this.poiServices.resetPOIMarkers();
    });
  }

  public subscribeToChangeInCurrentPOS() {
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
  }

  //show name of POI when clicked on a marker
  public clickedMarker(infowindow: any) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  public subscribeToUserInput() {
    this.directionService.origin.subscribe(resp => {
      if (Array.isArray(resp) && resp.length) {
        this.origin = { lat: resp[0], lng: resp[1] };
      } else {
        this.origin = null;
      }
    });
    this.directionService.destination.subscribe(resp => {
      if (Array.isArray(resp) && resp.length) {
        this.destination = { lat: resp[0], lng: resp[1] };
      } else {
        this.destination = null;
      }
    });
  }

  /*
      Creates popup containing Concordia building descriptions.
       */
  async showAlert(building: string, address: string) {

    let urlSubString;
    switch(building){
      case 'Hall Building': urlSubString = 'hall'; break;
      case 'John Molson Building': urlSubString = 'jmsb'; break;
      case 'JW McConnell Building': urlSubString = 'jw'; break;
      case 'Faubourg Building': urlSubString = 'fg'; break;
      case 'Faubourg Ste Catherine Building': urlSubString = 'fg-stcath'; break;
      case 'EV Building': urlSubString = 'ev'; break;
      case 'Guy-De Maisonneuve Building': urlSubString = 'gd'; break;
      case 'Grey Nuns': urlSubString = 'gn'; break;
      case 'Concordia Annexes': urlSubString = 'annexes'; break;
      case 'TD Building': urlSubString = 'td'; break;
      case 'Visual Arts Building': urlSubString = 'visual'; break;
      case 'Administration Building': urlSubString = 'admin'; break;
      case 'Central Building': urlSubString = 'central'; break;
      case 'Richard J. Renaud Science Complex': urlSubString = 'richard'; break;
      case 'Communication Studies and Journalism Building': urlSubString = 'comm'; break;
      case 'Vanier Library': urlSubString = 'vanier'; break;
      case 'Oscar Peterson Concert Hall': urlSubString = 'oscar'; break;
      case 'Student Center': urlSubString = 'student-center'; break;
      case 'Psychology Building': urlSubString = 'psyc'; break;
      case 'Recreation and Athletics Complex': urlSubString = 'recr'; break;
      case 'Hingston Hall': urlSubString = 'hh'; break;
      case 'FC Smith Building': urlSubString = 'fc'; break;
    }
    this.buildingToNavigateTo = building;
    const alert = await this.alertController.create({
      header: building,
      subHeader: address,
      cssClass: 'alert-css',
      buttons: [
        {
          text: 'Enter',
          cssClass: 'alert-button-map',
          handler: goIndoors => {
            if(urlSubString === 'jmsb'){
              let url = '/indoor' + '/jmsb';
              this.router.navigateByUrl(url);
              return true;
            } else {
              console.error('no floor plans for this building');
              return false;
            }
          }
        },
        {
          text: 'Go',
          cssClass: 'alert-button-go',
          handler: () => {
            this.goHere();
            return true;
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
  }

  /*
      Shows the user a path from their location to the Concordia building whose information they are looking at when the
      'Go' button is clicked on the building information popup
       */
  goHere() {
    let buildingLat: number;
    let buildingLng: number;

    for (let i = 0; i < this.overlayCoords.length; i++) {
      if (this.overlayCoords[i].name === this.buildingToNavigateTo) {
        buildingLat = this.overlayCoords[i].coords[0].lat;
        buildingLng = this.overlayCoords[i].coords[0].lng;
      }
    }
    this.directionService.isDirectionSet.next(true);
    this.dataSharingService.updateMapSize(-210);

    this.directionService.origin.next([
      this.geolocationServices.getLatitude(),
      this.geolocationServices.getLongitude()
    ]);
    this.directionService.destination.next([buildingLat, buildingLng]);

    this.buildingToNavigateTo = null;
  }
  //use to send data to other components
  sendMessage(updatedMessage: any) {
    this.data.updateMessage(updatedMessage);
  }

  public subscribeToMapSize() {
    this.dataSharingService.mapSize.subscribe(size => {
      this.height = size;
    });
  }

  public subscribeToTravelMode() {
    this.directionService.changeTravelMode.subscribe(travelMode => {
      this.travelMode = travelMode;
    });
  }

  public onResponse($event: any) {
    this.sendDirectionInfo($event);
    this.directionService.setDirectionsSteps($event.routes[0].legs[0].steps);
  }

  public sendDirectionInfo(directionInfo: any) {
    let fare: string;
    if (directionInfo.routes[0].fare) {
      fare = directionInfo.routes[0].fare.text;
    } else {
      fare = 'CA$0.00';
    }
    this.directionService.directionInfo.next({
      time: directionInfo.routes[0].legs[0].duration.text,
      distance: directionInfo.routes[0].legs[0].distance.text,
      fare
    });
  }
}
