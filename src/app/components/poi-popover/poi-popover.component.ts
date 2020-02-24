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
import { GeolocationServices } from 'src/services/geolocationServices';

@Component({
  selector: 'app-poi-popover',
  templateUrl: './poi-popover.component.html',
  styleUrls: ['./poi-popover.component.scss']
})
export class PoiPopoverComponent implements OnInit, AfterViewInit {
  private map;

  constructor(
    private popoverController: PopoverController,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private searchService: SearchService,
    private geolocationServices: GeolocationServices
  ) {}


  ngOnInit() {
    this.map = <HTMLDivElement>document.getElementById('google-map-component');
    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: {
        lat: this.geolocationServices.getLatitude(), 
        lng: this.geolocationServices.getLongitude()
      },
      radius: 500,
      type: 'store'
    }, (results,status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results)
        for (var i = 0; i < results.length; i++) {
          // this.createMarker(results[i]);
        }
      }
    });

  }

  createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: this.map,
    position: placeLoc
  });

  google.maps.event.addListener(marker, 'click', function() {
    // infowindow.setContent(place.name);
    // infowindow.open(map, this);
  });
}

  ngAfterViewInit() {}

  findAdress() {}

  async closePopover() {
    await this.popoverController.dismiss();
  }

  public updateMap() {

  }
}
