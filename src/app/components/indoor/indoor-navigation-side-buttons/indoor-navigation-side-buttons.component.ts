import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, Events } from '@ionic/angular';
import { RoomSelectorPopoverComponent } from '../../popovers/room-selector-popover/room-selector-popover';
import { InfoPopoverComponent } from '../../popovers/info-popover/info-popover.component';
import { DirectionsManagerService } from 'src/services/directionsManager.service';

@Component({
  selector: 'app-indoor-navigation-side-buttons',
  templateUrl: './indoor-navigation-side-buttons.component.html',
  styleUrls: ['./indoor-navigation-side-buttons.component.scss']
})
export class IndoorNavigationSideButtonsComponent {
  @Input() isSelectMode: boolean;

  private isIndoorDirectionsSet: boolean = false;

  constructor(
    public popoverController: PopoverController,
    private events: Events,
    private directionsManagerService : DirectionsManagerService,

  ) {
    this.events.subscribe('open-indoor-popup', data => {
      this.presentPopover(data);
    });

    //indoor directions subscription
    this.directionsManagerService.isInRoute.subscribe(res => {
      if(res === true){
        this.isIndoorDirectionsSet = true;
      } else {
        this.isIndoorDirectionsSet = false;
      }
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

    popover.style.cssText = '--width: calc(100% - 10px); top: 0px; right: 5px;';
    return await popover.present();
  }

  async showInfo(){
    const popover = await this.popoverController.create({
      component: InfoPopoverComponent,
      componentProps: {
        data: this.getData()
      },
      translucent: false
    });

    popover.style.cssText = 'top: -220px; left: 80px;';
    return await popover.present();
  }

  //return instructions to user
  private getData(){
    if(this.isSelectMode === true){
      return "Please select where you're comming from.";

    } else if(this.isSelectMode === false){
      if(this.isIndoorDirectionsSet === true){
        return "Follow the path to arrive at your destination.";

      } else {
        return "Press on any room to start navigation to it.";
      }
    }
  }
}
