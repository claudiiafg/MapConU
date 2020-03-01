import { Component, OnInit } from '@angular/core';
import { PopoverController, Events } from '@ionic/angular';
import { RoomSelectorPopoverComponent } from '../../popovers/room-selector-popover/room-selector-popover';

@Component({
  selector: 'app-indoor-navigation-side-buttons',
  templateUrl: './indoor-navigation-side-buttons.component.html',
  styleUrls: ['./indoor-navigation-side-buttons.component.scss']
})
export class IndoorNavigationSideButtonsComponent {
  constructor(
    public popoverController: PopoverController,
    private events: Events
  ) {
    this.events.subscribe('manually-enter-destination', data => {
      this.presentPopover(data);
    });
  }

  async presentPopover(data?: any) {
    const popover = await this.popoverController.create({
      component: RoomSelectorPopoverComponent,
      componentProps: {
        data: data
      },
      translucent: false
    });

    popover.style.cssText = '--width: 100%; top: -150px; right: 5px;';
    return await popover.present();
  }
}
