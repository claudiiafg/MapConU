import { MapsAPILoader } from '@agm/core';

import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Events, IonSearchbar } from '@ionic/angular';
import { DirectionService } from 'src/services/direction.service';
import { DataSharingService } from '../../../../services/data-sharing.service';

@Component({
  selector: 'app-outdoor-navigation-toolbar',
  templateUrl: './outdoor-navigation-toolbar.component.html',
  styleUrls: ['./outdoor-navigation-toolbar.component.scss']
})
export class OutdoorNavigationToolbarComponent implements OnInit, AfterViewInit {
  @ViewChild('search', { static: false }) public searchRef: IonSearchbar;
  public loc: string;
  public latitudeFound: number;
  public longitudeFound: number;
  public message: any;
  public isDirectionSet: boolean = false;
  public transitColor: string = 'white';
  public carColor: string = 'white';
  public walkColor: string = 'yellow';

  //Array for lat, long of specific locations
  public locations = [
    { latitude: 45.495729, longitude: -73.578041 },
    { latitude: 45.45824, longitude: -73.640452 }
  ];

  constructor(
    private data: DataSharingService,
    private events: Events,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public directionService: DirectionService,
  ) {
    this.data.currentMessage.subscribe(
      incomingMessage => (this.message = incomingMessage)
    );
    this.directionService.isDirectionSet.subscribe(isDirectionSet => {
      this.isDirectionSet = isDirectionSet;
    });
  }

  ngOnInit() {
    this.loc = '0';
  }

  ngAfterViewInit() {
    this.findAdress();
  }

  findAdress() {
    this.searchRef.getInputElement().then( input => {
      this.mapsAPILoader.load().then(() => {
        let toAutocomplete = new google.maps.places.Autocomplete(
          input,
          {
            types: ['address']
          }
        );

        toAutocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = toAutocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            this.latitudeFound = place.geometry.location.lat();
            this.longitudeFound = place.geometry.location.lng();
            this.moveToFoundLocation(this.latitudeFound, this.longitudeFound)
          });
        });
      });
    });
  }

  sendMessage(updatedMessage) {
    this.data.updateMessage(updatedMessage);
  }

  public changeCampus() {
    this.sendMessage(this.locations[this.loc]);
    this.events.publish('campusChanged', Date.now());
  }

  public moveToFoundLocation(lat: number, lng: number) {
    this.sendMessage({ latitude: lat, longitude: lng });
    this.events.publish('campusChanged', Date.now());
  }

  public closeAutocomplete() {
    this.searchRef.getInputElement().then( input => {
      input.blur();
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
}
