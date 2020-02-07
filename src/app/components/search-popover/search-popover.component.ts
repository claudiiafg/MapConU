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

@Component({
  selector: 'app-search-popover',
  templateUrl: './search-popover.component.html',
  styleUrls: ['./search-popover.component.scss']
})
export class SearchPopoverComponent implements OnInit, AfterViewInit {
  @ViewChild('to', { static: false }) public toAddressRef: ElementRef;
  @ViewChild('from', { static: false }) public fromAddressRef: ElementRef;
  public addressTo: string;
  public addressFrom: string;
  constructor(
    public popoverController: PopoverController,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone
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

          this.addressTo = place.formatted_address;
          console.log(this.addressTo);
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

          this.addressFrom = place.formatted_address;
          console.log(this.addressFrom);
        });
      });
    });
  }

  async closePopover() {
    await this.popoverController.dismiss();
  }
}
