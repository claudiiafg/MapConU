import {
  Component,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { PopoverController, Events } from '@ionic/angular';
import { PoiServices } from 'src/services/poiServices';


@Component({
  selector: 'app-poi-popover',
  templateUrl: './poi-popover.component.html',
  styleUrls: ['./poi-popover.component.scss']
})
export class PoiPopoverComponent {
  private restaurants: boolean = false;
  private coffee: boolean = false;
  private gas: boolean = false;
  private drugstore: boolean = false;
  private hotels: boolean = false;
  private grocery: boolean = false;


  constructor(
    private popoverController: PopoverController,
    private events: Events,
    private poiServices : PoiServices,

  ) {}

  ngOnInit(){
    const currentToggles = this.poiServices.getCurrentToggles();
    this.restaurants = currentToggles.restaurants;
    this.coffee = currentToggles.coffee;
    this.gas = currentToggles.gas;
    this.drugstore = currentToggles.drugstore;
    this.hotels = currentToggles.hotels;
    this.grocery = currentToggles.grocery;
  }

  update(toggle : string){
    let value: boolean;
    switch(toggle){
      case 'restaurants':   value = this.restaurants;
      case 'coffee shops':        value = this.coffee;
      case 'gas stations':           value = this.gas;
      case 'drugstores':     value = this.drugstore;
      case 'hotels':        value = this.hotels;
      case 'groceries':       value = this.grocery;
    }

    const data = {
      toggle : toggle,
      value : value
    }
    this.events.publish('poi-toggle-changed', data, Date.now())
  }

  closePopover() {
    this.popoverController.dismiss();
  }

}
