import { MapsAPILoader } from '@agm/core';

import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import { Events, IonSearchbar } from '@ionic/angular';
import { DirectionService } from 'src/services/direction.service';
import { GeolocationServices } from 'src/services/geolocation.services';
import { DataSharingService } from '../../../../services/data-sharing.service';
import { Router } from '@angular/router';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-outdoor-navigation-toolbar',
  templateUrl: './outdoor-navigation-toolbar.component.html',
  styleUrls: ['./outdoor-navigation-toolbar.component.scss'],
})
export class OutdoorNavigationToolbarComponent
  implements OnInit, AfterViewInit {
  @ViewChild('search', { static: false }) public searchRef: IonSearchbar;
  public loc: string;
  public latitudeFound: number;
  public longitudeFound: number;
  public message: any;
  public isDirectionSet: boolean = false;
  public transitColor: string = 'white';
  public carColor: string = 'white';
  public walkColor: string = 'yellow';
  readonly mapRadius: number = 0.3;
  public searchAutocomplete: any;
  currentLat: number = 45.495729;
  currentLng: number = -73.578041;

  //Array for lat, long of specific locations
  public locations = [
    { latitude: 45.495729, longitude: -73.578041 },
    { latitude: 45.45824, longitude: -73.640452 },
  ];

  constructor(
    private dataSharingService: DataSharingService,
    private events: Events,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public directionService: DirectionService,
    private router: Router,
    private translate: TranslationService,
    private geolocationServices: GeolocationServices
  ) {
    this.dataSharingService.currentMessage.subscribe(
      (incomingMessage) => (this.message = incomingMessage)
    );
    this.directionService.isDirectionSet.subscribe((isDirectionSet) => {
      this.isDirectionSet = isDirectionSet;
    });
  }

  async ngOnInit() {
    this.loc = '0';
    await this.geolocationServices.getCurrentPosition();
    this.currentLat = this.geolocationServices.getLatitude();
    this.currentLng = this.geolocationServices.getLongitude();
  }

  ngAfterViewInit() {
    this.findAddress();
  }

  findAddress() {
    this.searchRef.getInputElement().then((input) => {
      this.mapsAPILoader.load().then(() => {
        const nwBounds = new google.maps.LatLng({
          lat: this.currentLat - this.mapRadius,
          lng: this.currentLng - this.mapRadius,
        });
        const seBounds = new google.maps.LatLng({
          lat: this.currentLat + this.mapRadius,
          lng: this.currentLng + this.mapRadius,
        });
        this.searchAutocomplete = new google.maps.places.Autocomplete(input, {
          bounds: new google.maps.LatLngBounds(nwBounds, seBounds),
        });

        this.searchAutocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = this.searchAutocomplete.getPlace();

            if (!place.geometry) {
              return;
            }

            this.latitudeFound = place.geometry.location.lat();
            this.longitudeFound = place.geometry.location.lng();
            this.moveToFoundLocation(
              this.latitudeFound,
              this.longitudeFound,
              place.geometry.viewport
            );
          });
        });

        this.events.subscribe('mapClicked', () => {
          input.blur();
        });
      });
    });
  }

  public changeCampus() {
    /* Added as a workaround to get the select menu for campuses to reload when the language changes.
    A variable change is required to trigger an automatic reload but campus should not be changed
     */
    if (this.loc == '2') {
      this.loc = '0';
    }
    this.dataSharingService.updateMessage(this.locations[this.loc]);
    this.events.publish('campusChanged', Date.now());
  }

  public moveToFoundLocation(lat: number, lng: number, mapBounds: any) {
    this.dataSharingService.updateMessage({
      latitude: lat,
      longitude: lng,
      mapBounds: mapBounds,
    });
    this.events.publish('coordinatesChanged', {
      latitude: lat,
      longitude: lng,
      mapBounds: mapBounds,
    });
  }

  public changeTravelMode(travelMode: string) {
    this.setSelectedColor(travelMode);

    if (this.directionService.alternateDirection) {
      this.directionService.alternateDirection.set('directions', null);
      this.directionService.alternateDirectionSet = false;
    }

    this.directionService.changeTravelMode.next(travelMode);
  }

  /**
   * Function to set the color of icon selected when user switch between different travel mode.
   * @param travelMode Travel mode selected by the user. Possible values currently within the app are DRIVING, TRANSIT, WALKING.
   */
  public setSelectedColor(travelMode: string) {
    if (travelMode === 'DRIVING') {
      this.carColor = 'yellow';
      this.transitColor = 'white';
      this.walkColor = 'white';
    } else if (travelMode === 'TRANSIT') {
      this.carColor = 'white';
      this.transitColor = 'yellow';
      this.walkColor = 'white';
    } else {
      this.carColor = 'white';
      this.transitColor = 'white';
      this.walkColor = 'yellow';
    }
  }
  /*
  Takes the user to the settings page
   */
  public adjustSettings() {
    this.router.navigateByUrl('/appSettings');
  }
}
