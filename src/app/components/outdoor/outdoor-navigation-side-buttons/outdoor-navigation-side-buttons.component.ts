import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { Events, PopoverController } from '@ionic/angular';
import { PoiPopoverComponent } from '../../popovers/poi-popover/poi-popover.component';
import { SearchPopoverComponent } from '../../popovers/search-popover/search-popover.component';
import { DirectionService } from 'src/services/direction.service';
import { DataSharingService } from 'src/services/data-sharing.service';
import { DirectionsManagerService } from 'src/services/directionsManager.service';

@Component({
  selector: 'app-outdoor-navigation-side-buttons',
  templateUrl: './outdoor-navigation-side-buttons.component.html',
  styleUrls: ['./outdoor-navigation-side-buttons.component.scss']
})
export class OutdoorNavigationSideButtonsComponent implements OnInit {
  public poiClicked: boolean = false;
  public isDirectionSet: boolean = false;
  public bottomStyle: number = 0;

  constructor(
    public popoverController: PopoverController,
    private events: Events,
    public modalController: ModalController,
    public directionService: DirectionService,
    private dataSharingService: DataSharingService,
    private directionManager: DirectionsManagerService,
  ) {
    this.directionService.isDirectionSet.subscribe(
      (isDirectionSet: boolean) => {
        this.isDirectionSet = isDirectionSet;
        this.bottomStyle = isDirectionSet ? -7 : 0;
      }
    );
  }

  ngOnInit() {}

  async openViewer() {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: './assets/schedule/schedule.png'
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

  async presentPopover(ev: any, mode: string) {
    if (mode === 'search') {
      const popover = await this.popoverController.create({
        component: SearchPopoverComponent,
        event: ev,
        translucent: false
      });

      popover.style.cssText =
        '--width: calc(100% - 10px); top: -230px; left: 5px';
      return await popover.present();
    } else if (mode === 'poi') {
      this.poiClicked = !this.poiClicked;
      this.events.publish('poi-clicked', Date.now());
      const popover = await this.popoverController.create({
        component: PoiPopoverComponent,
        event: ev,
        translucent: false
      });

      popover.onDidDismiss().then(() => {
        this.poiClicked = false;
      });

      popover.style.cssText =
        '--width: 200px; top: 30%; left: calc(50% - 100px);';
      return await popover.present();
    }
  }

  public close() {
    this.directionManager.resetSteps()
    this.directionService.origin.next([]);
    this.directionService.destination.next([]);
    this.directionService.isDirectionSet.next(false);
    this.directionService.closeInfoWindows();
    this.dataSharingService.updateMapSize(-106);

    if (this.directionService.alternateDirection) {
      this.directionService.alternateDirection.set('directions', null);
      this.directionService.alternateDirectionSet = false;
    }
  }
}
