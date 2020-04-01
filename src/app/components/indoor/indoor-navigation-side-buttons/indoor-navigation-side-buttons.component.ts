import { Component, Input } from '@angular/core';
import { PopoverController, Events } from '@ionic/angular';
import { RoomSelectorPopoverComponent } from '../../popovers/room-selector-popover/room-selector-popover.component';
import { InfoPopoverComponent } from '../../popovers/info-popover/info-popover.component';
import { DirectionsManagerService } from 'src/services/directionsManager.service';
import { TranslationService } from 'src/services/translation.service';
import { DataSharingService} from '../../../../services/data-sharing.service';
import { IndoorPoiPopoverComponent} from '../../popovers/indoor-poi-popover/indoor-poi-popover.component';

@Component({
  selector: 'app-indoor-navigation-side-buttons',
  templateUrl: './indoor-navigation-side-buttons.component.html',
  styleUrls: ['./indoor-navigation-side-buttons.component.scss']
})
export class IndoorNavigationSideButtonsComponent {
  @Input() isSelectMode: boolean;
  private showToa: boolean = false;

  constructor(
    public popoverController: PopoverController,
    private events: Events,
    private directionsManagerService: DirectionsManagerService,
    private translate: TranslationService,
    private dataSharing: DataSharingService
  ) {
    this.events.subscribe('open-indoor-popup', data => {
      this.presentPopover(data);
    });
  }

  ngOnInit() {
    this.subscribeToshowToa();
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

  async showInfo() {
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

  async showIndoorPoi(){
    const popover = await this.popoverController.create({
      component: IndoorPoiPopoverComponent,
      translucent: false
    });
    return await popover.present();
  }

  //return instructions to user
  private getData() {
    if (this.isSelectMode === true) {
      return this.translate.getTranslation('select-source-instruction');
    } else if (this.isSelectMode === false) {
      if (this.directionsManagerService.isIndoorInRoute.getValue() === true) {
        return this.translate.getTranslation('follow-path-instructions');
      } else {
        return this.translate.getTranslation('press-on-room-instruction');
      }
    }
  }

  subscribeToshowToa(){
    this.dataSharing.showToa.subscribe(updateShow =>{
      this.showToa = updateShow;
    })
  }

  cancelPath(){
    this.dataSharing.showIndoorToa(false);
  }
}
