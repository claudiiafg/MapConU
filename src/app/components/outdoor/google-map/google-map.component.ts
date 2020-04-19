import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SqliteService } from '../../../../services/sqlite.service';
import {
  AlertController,
  Events,
  NavController,
  Platform,
} from '@ionic/angular';
import { DirectionService } from 'src/services/direction.service';
//services

import { GeolocationServices } from 'src/services/geolocation.services';
import { PoiServices } from 'src/services/poi.services';
import { DataSharingService } from '../../../../services/data-sharing.service';
import { isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../../../services/translation.service';
import { DirectionsManagerService, MixedDirectionsType } from 'src/services/directionsManager.service';

//DO NOT REMOVE
//code will be used for dev purposes
//see extraInfo.ts for more info
// this.overlayCoords = externalOverlayCoords;
import { externalOverlayCoords } from './extraInfo';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
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
  public travelMode = 'WALKING';
  public previous: any;
  private sub;
  public currentToggles: any = {
    restaurants: false,
    coffee: false,
    gas: false,
    drugstore: false,
    hotels: false,
    grocery: false,
  };
  public provideRouteAlternatives: boolean = true;
  public map: any;
  static isOpen: boolean;
  public overlayCoords: any[] = [];
  // Directions rendering options
  public walkingNotSelectedRenderOptions = {
    polylineOptions: {
      strokeOpacity: 0,
      icons: [
        {
          icon: {
            path: 'M 1, 1 m -1, 0 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0', // SVG path for circle
            fillColor: '#808080',
            fillOpacity: 1,
            scale: 2,
            strokeColor: '#808080',
            strokeOpacity: 1,
          },
          offset: '0',
          repeat: '10px',
        },
      ],
    },
  };

  public walkingSelectedRenderOptions = {
    polylineOptions: {
      strokeOpacity: 0,
      icons: [
        {
          icon: {
            path: 'M 1, 1 m -1, 0 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0', // SVG path for circle
            fillColor: '#339fff',
            fillOpacity: 1,
            scale: 2,
            strokeColor: '#339fff',
            strokeOpacity: 1,
          },
          offset: '0',
          repeat: '10px',
        },
      ],
    },
  };

  public notSelectedRenderOptions = {
    polylineOptions: {
      strokeColor: '#808080',
    },
  };

  public selectedRenderOptions = {
    polylineOptions: {
      strokeColor: '#339fff',
    },
  };

  public renderOptions: any = this.walkingSelectedRenderOptions;

  // Marker
  public positionMarkerIcon = {
    url: 'assets/icon/position-marker.png',
    scaledSize: {
      width: 15,
      height: 15,
    },
  };

  private buildingToNavigateTo: string;
  private currentRouteSelected: string = 'Main';

  poiMarkerIcon = {
    resto: {
      url: 'assets/icon/Marker_Restaurant.png',
      scaledSize: {
        width: 20,
        height: 20,
      },
    },
    coffee: {
      url: 'assets/icon/Marker_Coffee.png',
      scaledSize: {
        width: 20,
        height: 20,
      },
    },
    gas: {
      url: 'assets/icon/Marker_Gas_Station.png',
      scaledSize: {
        width: 20,
        height: 20,
      },
    },
    hotel: {
      url: 'assets/icon/Marker_Hotel.png',
      scaledSize: {
        width: 20,
        height: 20,
      },
    },
    drug: {
      url: 'assets/icon/Marker_Drugstore.png',
      scaledSize: {
        width: 20,
        height: 20,
      },
    },
    groceries: {
      url: 'assets/icon/Marker_Groceries.png',
      scaledSize: {
        width: 20,
        height: 20,
      },
    },
  };

  private readonly defaultCampusZoom = 17;

  constructor(
    private platform: Platform,
    private geolocationServices: GeolocationServices,
    private events: Events,
    private directionService: DirectionService,
    private poiServices: PoiServices,
    private alertController: AlertController,
    private navController: NavController,
    private router: Router,
    private dataSharingService: DataSharingService,

    private translate: TranslationService,
    private db: SqliteService,
    private route: ActivatedRoute,
    private directionsManager: DirectionsManagerService
  ) {
    GoogleMapComponent.isOpen = false;
  }

  async ngOnInit() {
    await this.db.platform.ready();

    //DO NOT REMOVE
    //code will be used for dev purposes
    //see extraInfo.ts for more info
    // this.overlayCoords = externalOverlayCoords;

    this.db.dbState().subscribe((res) =>{
      if (res){
        this.db.fetchBuildings().subscribe(item => {
          //console.log(item);
          if (item.length != 0){

            this.overlayCoords = item;
          }
        })
      }
    });

    await this.platform.ready();
    this.height = this.platform.height() - 106;
    await this.geolocationServices.getCurrentPosition();

    this.subscribeToMapSize();
    this.subscribeToTravelMode();
    this.subscribeToChangeInCurrentPOS();
    this.subscribeToChangeInPOI();
    this.subscribeToIndoorDirectionsCompleted();
    this.subscribeToToggleCenterLocation();
  }

  public subscribeToIndoorDirectionsCompleted(){
    //when user ends route -> reset navidation
    this.events.subscribe('path-completed', res => {
      this.directionsManager.resetSteps();
    });
  }

  public mapReady($event: any) {
    let self = this;
    this.map = $event;
    let panorama = this.map.getStreetView();
    google.maps.event.addListener(panorama, 'visible_changed', function() {
      if (panorama.getVisible()) {
        self.dataSharingService.updateShowSideButtons(false);
      } else {
        self.dataSharingService.updateShowSideButtons(true);
      }
    });
    this.map.addListener('click', (event) => {
        this.events.publish('mapClicked');
        if (event.placeId) {
          this.events.publish("poi-selected", {placeId: event.placeId, latitude: event.latLng.lat(), longitude: event.latLng.lng()});
        }
        else{
          this.events.publish("poi-unselected");
        }
    });
  }

  public subscribeToChangeInPOI() {
    //subscribe to changes in POI toggles
    this.events.subscribe('poi-toggle-changed', async (res) => {
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

    //as a toggle is clicked, update the current toggles
    this.events.subscribe('poi-clicked', () => {
      this.events.publish('set-poi-toggles', this.currentToggles, Date.now());
    });
    this.events.subscribe('campusChanged', () => {
      this.poiMarkers = [];
      this.currentToggles = this.poiServices.resetPOIMarkers();
      this.map.setZoom(this.defaultCampusZoom);
    });
  }

  public subscribeToToggleCenterLocation()
  {
    this.events.subscribe('centerLocation', (coordinates) => {
      this.map.setCenter(new google.maps.LatLng(coordinates.latitude, coordinates.longitude));
      this.map.setZoom(this.defaultCampusZoom);
    })
  }

  public subscribeToChangeInCurrentPOS() {
    //subscribe to changes in current position
    this.events.subscribe('coordinatesChanged', (coordinates) => {
      let tempMarker = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
      this.positionMarkers = [];
      this.positionMarkers.push(tempMarker);
      if (coordinates.mapBounds) {
        this.map.fitBounds(coordinates.mapBounds);
      }
    });

    this.dataSharingService.currentMessage.subscribe((incomingMessage) => {
      this.latitude = incomingMessage.latitude;
      this.longitude = incomingMessage.longitude;
    });
    this.subscribeToUserInput();
  }

  //show name of POI when clicked on a marker
  public clickedMarker(infowindow: any) {
    console.log(infowindow.hostMarker)
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
    this.events.publish("poi-selected", {latitude: infowindow.hostMarker.latitude, longitude: infowindow.hostMarker.longitude});
  }

  public subscribeToUserInput() {
    this.directionService.origin.subscribe((resp) => {
      if (Array.isArray(resp) && resp.length) {
        this.origin = { lat: resp[0], lng: resp[1] };
      } else {
        this.origin = null;
      }
    });
    this.directionService.destination.subscribe((resp) => {
      if (Array.isArray(resp) && resp.length) {
        this.destination = { lat: resp[0], lng: resp[1] };
      } else {
        this.destination = null;
      }
    });
  }

  getIcon(poiMarker: any) {
    if (poiMarker.type === 'restaurant') {
      return this.poiMarkerIcon.resto;
    } else if (poiMarker.type === 'coffee shop') {
      return this.poiMarkerIcon.coffee;
    } else if (poiMarker.type === 'gas station') {
      return this.poiMarkerIcon.gas;
    } else if (poiMarker.type === 'drugstore') {
      return this.poiMarkerIcon.drug;
    } else if (poiMarker.type === 'hotel') {
      return this.poiMarkerIcon.hotel;
    } else if (poiMarker.type === 'groceries') {
      return this.poiMarkerIcon.groceries;
    }
  }

  /**
   * Creates popup containing Concordia building descriptions and buttons "Go" to give the user directions
   * to this building from their current location and "Enter" to take the user to the indoor layout of the building
   * if it is available.
   *
   * @param building Name of the Concordia building to generate popup for
   * @param address Address of the Concordia building to generate popup for
   *
   */
  async showAlert(building: string, address: string) {
    GoogleMapComponent.isOpen = true;

    let urlSubString;
    switch (building) {
      case 'Hall Building':
        urlSubString = 'hall';
        break;
      case 'John Molson Building':
        urlSubString = 'jmsb';
        break;
      case 'JW McConnell Building':
        urlSubString = 'jw';
        break;
      case 'Faubourg Building':
        urlSubString = 'fg';
        break;
      case 'Faubourg Ste Catherine Building':
        urlSubString = 'fg-stcath';
        break;
      case 'EV Building':
        urlSubString = 'ev';
        break;
      case 'Guy-De Maisonneuve Building':
        urlSubString = 'gd';
        break;
      case 'Grey Nuns':
        urlSubString = 'gn';
        break;
      case 'Concordia Annexes':
        urlSubString = 'annexes';
        break;
      case 'TD Building':
        urlSubString = 'td';
        break;
      case 'Visual Arts Building':
        urlSubString = 'visual';
        break;
      case 'Administration Building':
        urlSubString = 'admin';
        break;
      case 'Central Building':
        urlSubString = 'central';
        break;
      case 'Richard J. Renaud Science Complex':
        urlSubString = 'richard';
        break;
      case 'Communication Studies and Journalism Building':
        urlSubString = 'comm';
        break;
      case 'Vanier Library':
        urlSubString = 'vanier';
        break;
      case 'Oscar Peterson Concert Hall':
        urlSubString = 'oscar';
        break;
      case 'Student Center':
        urlSubString = 'student-center';
        break;
      case 'Psychology Building':
        urlSubString = 'psyc';
        break;
      case 'Recreation and Athletics Complex':
        urlSubString = 'recr';
        break;
      case 'Hingston Hall':
        urlSubString = 'hh';
        break;
      case 'FC Smith Building':
        urlSubString = 'fc';
        break;
    }
    this.buildingToNavigateTo = building;

    const alert = await this.alertController.create({
      header: this.translate.getTranslation(building),
      subHeader: address,
      cssClass: 'alert-css',
      message: '',
      buttons: [
        {
          text: this.translate.getTranslation('enter'),
          cssClass: 'alert-button-map',
          handler: () => {
            if (urlSubString === 'jmsb' || urlSubString === 'hall' || urlSubString === 'vanier') {
              if (this.router.url.includes('/outdoor/isMixedNav')) {
                this.pushIndoorStep(false);
                this.directionsManager.setMixedType(
                  MixedDirectionsType.classToClass
                );
                this.events.publish('isSelectMode', true, Date.now());
              }
              let url = '/indoor/' + urlSubString;

              this.router.navigateByUrl(url);
              GoogleMapComponent.isOpen = false;

              return true;
            } else {
              console.error('no floor plans for this building');
              GoogleMapComponent.isOpen = false;

              alert.message =
                this.translate.getTranslation('no-floor-plan-msg') +
                this.translate.getTranslation(building);
              console.error('no floor plans for this building');
              return false;
            }
          },
        },
        /**
         * @hidden
         * This button has it's opacity set to 0 and does not show up on the building info box but it needs to be
         * here so that the alert dismisses properly when the user clicks outside the box to close it.
         * DO NOT REMOVE!!
         */
        {
          text: 'x',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
          handler: () => {
            console.log('building-popup closed');
            GoogleMapComponent.isOpen = false;
          },
        },
        {
          text: this.translate.getTranslation('go'),
          cssClass: 'alert-button-go',
          handler: () => {
            this.goHere();
            GoogleMapComponent.isOpen = false;

            return true;
          },
        },
      ],
    });

    await alert.present();
    GoogleMapComponent.isOpen = false;
  }

  /**
   *  Shows the user a path from their location to the Concordia building whose information they are looking at when
   *  the'Go' button is clicked on the building information popup
   *
   */

  goHere() {
    if (this.router.url.includes('/outdoor/isMixedNav')) {
      this.pushIndoorStep(true);
      this.directionsManager.isIndoorInRoute.next(true);
      this.directionsManager.isMixedInRoute.next(true);
    } else {
      let buildingLat: number;
      let buildingLng: number;

      for (let i = 0; i < this.overlayCoords.length; i++) {
        if (this.overlayCoords[i].name === this.buildingToNavigateTo) {
          buildingLat = this.overlayCoords[i].coords[0].lat;
          buildingLng = this.overlayCoords[i].coords[0].lng;
        }
      }
      this.directionService.isDirectionSet.next(true);

      if (this.directionService.alternateDirection) {
        this.directionService.alternateDirection.set('directions', null);
        this.directionService.alternateDirectionSet = false;
      }

      this.dataSharingService.updateMapSize(-210);

      this.directionService.origin.next([
        this.geolocationServices.getLatitude(),
        this.geolocationServices.getLongitude(),
      ]);
      this.directionService.destination.next([buildingLat, buildingLng]);

      this.buildingToNavigateTo = null;
    }
  }

  public pushIndoorStep(isLast: boolean) {
    let fromBuildingLat: number;
    let fromBuildingLng: number;
    let fromBuilding: any;
    let toBuildingLat: number;
    let toBuildingLng: number;
    let toBuilding: any;
    this.sub = this.route.params.subscribe((params) => {
      if (params['id']) {
        if (params['id'] === 'hall') {
          fromBuilding = this.overlayCoords.filter(
            (overlay) => overlay.name === 'Hall Building'
          )[0];
          fromBuildingLat = fromBuilding.coords[0].lat;
          fromBuildingLng = fromBuilding.coords[0].lng;
        } else if (params['id'] === 'jmsb') {
          fromBuilding = this.overlayCoords.filter(
            (overlay) => overlay.name === 'John Molson Building'
          )[0];
          fromBuildingLat = fromBuilding.coords[0].lat;
          fromBuildingLng = fromBuilding.coords[0].lng;
        } else if (params['id'] === 'vanier') {
          fromBuilding = this.overlayCoords.filter(
            (overlay) => overlay.name === 'Vanier Library'
          )[0];
          fromBuildingLat = fromBuilding.coords[0].lat;
          fromBuildingLng = fromBuilding.coords[0].lng;
        }
      }
    });
    toBuilding = this.overlayCoords.filter(
      (overlay) => overlay.name === this.buildingToNavigateTo
    )[0];
    toBuildingLat = toBuilding.coords[0].lat;
    toBuildingLng = toBuilding.coords[0].lng;
    const to = {
      building: toBuilding,
      lat: toBuildingLat,
      lng: toBuildingLng,
    };
    const from = {
      building: fromBuilding,
      lat: fromBuildingLat,
      lng: fromBuildingLng,
    };
    const tempStep = {
      source: from,
      dest: to,
      wasDone: false,
      isLast: isLast,
    };
    this.directionsManager.pushStep(tempStep);
  }

  public subscribeToMapSize() {
    this.dataSharingService.mapSize.subscribe((size) => {
      this.height = size;
    });
  }

  public subscribeToTravelMode() {
    this.directionService.changeTravelMode.subscribe((travelMode) => {
      this.travelMode = travelMode;
    });
  }

  // This function is triggered when the API send back a response
  public onResponse($event: any) {
    this.directionService.closeMainWindow();
    let routeIndex = this.currentRouteSelected === 'Main' ? 0 : 1;
    this.sendDirectionInfo($event.routes[routeIndex]);
    this.directionService.setDirectionsSteps(
      $event.routes[routeIndex].legs[0].steps
    );
    this.setInfoWindow($event.routes[0], 'Main', $event.request.travelMode);
    this.setAlternativeRoute($event);
    this.setRenderOptions($event);
  }

  private setRenderOptions(directionInfo: any) {
    this.changeRouteColors(
      this.currentRouteSelected,
      directionInfo.request.travelMode
    );
  }

  private sendDirectionInfo(route: any, presentModal?: boolean) {
    let fare: string;
    // fare
    if (route.fare) {
      fare = route.fare.text;
    } else {
      fare = 'CA$0.00';
    }
    // Alert subscribers that time, distance, and fare for direction info is updated.
    this.directionService.directionInfo.next({
      time: route.legs[0].duration.text,
      distance: route.legs[0].distance.text,
      fare,
      presentModal,
    });
  }

  private setAlternativeRoute(directionInfo: any) {
    // if there is an alternative route and it isn't set
    if (
      directionInfo.routes[1] &&
      this.directionService.alternateDirectionSet === false
    ) {
      this.directionService.closeAlternateWindow();

      const polyLine: any =
        directionInfo.request.travelMode === 'WALKING'
          ? this.walkingNotSelectedRenderOptions
          : this.notSelectedRenderOptions;

      this.directionService.alternateDirection = new google.maps.DirectionsRenderer(
        {
          map: this.map,
          directions: directionInfo,
          routeIndex: 1,
          polylineOptions: polyLine.polylineOptions,
        }
      );

      this.setInfoWindow(
        directionInfo.routes[1],
        'Alternative',
        directionInfo.request.travelMode
      );
      this.directionService.alternateDirectionSet = true;
    }
  }

  private setInfoWindow(route: any, type: string, travelMode: string) {
    let infoWindow = new google.maps.InfoWindow();

    if (isPlatformBrowser) {
      let div = document.createElement('div');
      div.innerHTML =
        route.legs[0].distance.text +
        ' - ' +
        type +
        '<br>' +
        route.legs[0].duration.text +
        '<br>' +
        ' ';
      div.onclick = () => {
        this.infoWindowClicked(route, type, travelMode);
      };
      infoWindow.setContent(div);
      let stepsLength = route.legs[0].steps.length;
      infoWindow.setPosition(
        route.legs[0].steps[Math.floor(stepsLength / 2)].end_location
      );
      infoWindow.open(this.map);

      this.directionService.addInfoWindow(infoWindow, type);
    }
  }

  private infoWindowClicked(route: any, type: string, travelMode: string) {
    this.currentRouteSelected = type;
    this.changeRouteColors(type, travelMode);
    this.directionService.setDirectionsSteps(route.legs[0].steps);
    this.sendDirectionInfo(route, true);
  }

  private changeRouteColors(type: string, travelMode: string) {
    if (type === 'Alternative') {
      if (travelMode === 'WALKING') {
        // Walk + Alternative options
        this.renderOptions = this.walkingNotSelectedRenderOptions;

        if (this.directionService.alternateDirection) {
          this.directionService.alternateDirection.setOptions(
            this.walkingSelectedRenderOptions
          );
        }
      } else {
        // car or transit + Alternative options
        this.renderOptions = this.notSelectedRenderOptions;

        if (this.directionService.alternateDirection) {
          this.directionService.alternateDirection.setOptions(
            this.selectedRenderOptions
          );
        }
      }
    } else {
      if (travelMode === 'WALKING') {
        // Walk + Main options
        this.renderOptions = this.walkingSelectedRenderOptions;

        if (this.directionService.alternateDirection) {
          this.directionService.alternateDirection.setOptions(
            this.walkingNotSelectedRenderOptions
          );
        }
      } else {
        // car or transit + Main options
        this.renderOptions = this.selectedRenderOptions;

        if (this.directionService.alternateDirection) {
          this.directionService.alternateDirection.setOptions(
            this.notSelectedRenderOptions
          );
        }
      }
    }
    if (this.directionService.alternateDirection) {
      this.directionService.alternateDirection.setMap(this.map);
    }
  }
}
