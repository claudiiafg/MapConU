import {
  Component,
  OnInit,
  AfterViewInit,
  NgZone,
  ElementRef,
  ViewChild
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MapsAPILoader } from '@agm/core';
import { SearchService } from 'src/services/search.service';

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
  constructor(
    public popoverController: PopoverController,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public searchService: SearchService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.findAdress();
  }

  findAdress() {
    this.mapsAPILoader.load().then(() => {
      let toAutocomplete = new google.maps.places.Autocomplete(
        this.toAddressRef.nativeElement,
        {
          types: ['address']
        }
      );

      let fromAutoComplete = new google.maps.places.Autocomplete(
        this.fromAddressRef.nativeElement,
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
    if (this.latitudeTo && this.latitudeFrom) {
      this.searchService.origin.next([this.latitudeFrom, this.longitudeFrom]);
      this.searchService.destination.next([this.latitudeTo, this.longitudeTo]);
    }
  }
}
