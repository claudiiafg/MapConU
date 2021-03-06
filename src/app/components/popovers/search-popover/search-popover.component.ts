import { MapsAPILoader } from '@agm/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
import { DataSharingService } from 'src/services/data-sharing.service';
import { DirectionService } from 'src/services/direction.service';
import { GeolocationServices } from 'src/services/geolocation.services';

@Component({
  selector: 'app-search-popover',
  templateUrl: './search-popover.component.html',
  styleUrls: ['./search-popover.component.scss']
})
export class SearchPopoverComponent implements OnInit, AfterViewInit {
  @ViewChild('to', { static: false }) public toAddressRef: ElementRef;
  @ViewChild('from', { static: false }) public fromAddressRef: ElementRef;
  latitudeTo: number;
  longitudeTo: number;
  latitudeFrom: number;
  longitudeFrom: number;
  readonly mapRadius: number = 0.3;
  currentLat: number = 45.495729;
  currentLng: number = -73.578041;
  constructor(
    public popoverController: PopoverController,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public directionService: DirectionService,
    private platform: Platform,
    private dataSharingService: DataSharingService,
    private geolocationServices: GeolocationServices
  ) {}

  async ngOnInit() {
    await this.geolocationServices.getCurrentPosition();
    this.latitudeFrom = this.currentLat = this.geolocationServices.getLatitude();
    this.longitudeFrom = this.currentLng = this.geolocationServices.getLongitude();
  }

  ngAfterViewInit() {
    this.findAddress();
  }

  findAddress() {
    this.mapsAPILoader.load().then(() => {
      const nwBounds = new google.maps.LatLng({
        lat: this.currentLat - this.mapRadius,
        lng: this.currentLng - this.mapRadius
      });
      const seBounds = new google.maps.LatLng({
        lat: this.currentLat + this.mapRadius,
        lng: this.currentLng + this.mapRadius
      });
      let toAutocomplete = new google.maps.places.Autocomplete(
        this.toAddressRef.nativeElement,
        {
          bounds: new google.maps.LatLngBounds(nwBounds, seBounds)
        }
      );

      let fromAutoComplete = new google.maps.places.Autocomplete(
        this.fromAddressRef.nativeElement,
        {
          bounds: new google.maps.LatLngBounds(nwBounds, seBounds)
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

          this.latitudeTo = place.geometry.location.lat();
          this.longitudeTo = place.geometry.location.lng();
        });
      });

      fromAutoComplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = fromAutoComplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.latitudeFrom = place.geometry.location.lat();
          this.longitudeFrom = place.geometry.location.lng();
        });
      });
    });
  }

  async closePopover() {
    await this.popoverController.dismiss();
  }

  public updateMap() {
    this.closePopover();
    if (!this.latitudeFrom) {
      this.latitudeFrom = this.geolocationServices.getLatitude();
      this.longitudeFrom = this.geolocationServices.getLongitude();
    }
    if (this.latitudeTo && this.latitudeFrom) {
      // set alternate direction to false if present
      if (this.directionService.alternateDirectionSet) {
        this.directionService.alternateDirection.set('directions', null);
        this.directionService.alternateDirectionSet = false;
      }
      this.directionService.isDirectionSet.next(true);
      this.dataSharingService.updateMapSize(-210);

      this.directionService.origin.next([
        this.latitudeFrom,
        this.longitudeFrom
      ]);

      this.directionService.destination.next([
        this.latitudeTo,
        this.longitudeTo
      ]);
    }
  }
}
