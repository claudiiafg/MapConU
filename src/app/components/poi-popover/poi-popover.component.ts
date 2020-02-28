import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  private isFirstOpen: boolean;

  constructor(
    private popoverController: PopoverController,
    private events: Events,
    private poiServices: PoiServices
  ) {}

  ngOnInit() {
    let currentToggles = this.poiServices.getCurrentToggles();
    this.restaurants = currentToggles.restaurants;
    this.coffee = currentToggles.coffee;
    this.gas = currentToggles.gas;
    this.drugstore = currentToggles.drugstore;
    this.hotels = currentToggles.hotels;
    this.grocery = currentToggles.grocery;
  }

  update(toggle: string) {
    let value;
    switch (toggle) {
      case 'restaurant':
        value = this.restaurants;
        break;
      case 'coffee shop':
        value = this.coffee;
        break;
      case 'gas station':
        value = this.gas;
        break;
      case 'drugstore':
        value = this.drugstore;
        break;
      case 'hotel':
        value = this.hotels;
        break;
      case 'groceries':
        value = this.grocery;
        break;
    }

    const data = {
      toggle: toggle,
      value: value
    };
    this.events.publish('poi-toggle-changed', data, Date.now());
  }

  closePopover() {
    this.popoverController.dismiss();
  }
}
