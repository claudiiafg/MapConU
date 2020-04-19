import { Component, Input } from '@angular/core';
import { ModalController, PopoverController, Events } from '@ionic/angular';
import { RoomSelectorPopoverComponent } from '../../popovers/room-selector-popover/room-selector-popover.component';
import { InfoPopoverComponent } from '../../popovers/info-popover/info-popover.component';
import { DirectionsManagerService } from 'src/services/directionsManager.service';
import { TranslationService } from 'src/services/translation.service';
import { DataSharingService} from '../../../../services/data-sharing.service';
import { IndoorPoiPopoverComponent} from '../../popovers/indoor-poi-popover/indoor-poi-popover.component';
import { CalendarComponent } from '../../popovers/calendar/calendar.component';

@Component({
  selector: 'app-indoor-navigation-side-buttons',
  templateUrl: './indoor-navigation-side-buttons.component.html',
  styleUrls: ['./indoor-navigation-side-buttons.component.scss']
})
export class IndoorNavigationSideButtonsComponent {
  @Input() isSelectMode: boolean;
  private showToa: boolean = false;
  private currentPopover = null;


  constructor(
    public popoverController: PopoverController,
    private events: Events,
    private directionsManagerService: DirectionsManagerService,
    private translate: TranslationService,
    private dataSharing: DataSharingService,
    private modalController: ModalController
  ) {
    this.events.subscribe('open-indoor-popup', (data, time) => {
      this.presentPopover(data);
    });
    this.events.subscribe('close-indoor-popup', () => {
      this.currentPopover = null;
    });
  }

  ngOnInit() {
    this.subscribeToshowToa();
  }

  async presentPopover(data?: any) {
    if(this.currentPopover === null){
      this.currentPopover = await this.popoverController.create({
        component: RoomSelectorPopoverComponent,
        componentProps: {
          data: data
        },
        translucent: false
      });

      this.currentPopover.style.cssText = '--width: calc(100% - 10px); top: 0px; right: 5px;';
      await this.currentPopover.present();
      setTimeout(()=> {
        this.currentPopover = null;
      }, 500);
    }
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
    this.dataSharing.updateIndoorPoiToggles(true);
    const popover = await this.popoverController.create({
      component: IndoorPoiPopoverComponent,
      translucent: false
    });
    return await popover.present();
  }

  async openCalendar() {
    const modal = await this.modalController.create({
      component: CalendarComponent
    })

    return await modal.present();
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
