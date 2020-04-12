import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { Events, PopoverController } from '@ionic/angular';
import { PoiPopoverComponent } from '../../popovers/poi-popover/poi-popover.component';
import { SearchPopoverComponent } from '../../popovers/search-popover/search-popover.component';
import { CalendarComponent } from '../../popovers/calendar/calendar.component';
import { DirectionService } from 'src/services/direction.service';
import { DataSharingService } from 'src/services/data-sharing.service';
import { DirectionsManagerService, MixedDirectionsType } from 'src/services/directionsManager.service';
import { GeolocationServices } from 'src/services/geolocation.services';

@Component({
  selector: 'app-outdoor-navigation-side-buttons',
  templateUrl: './outdoor-navigation-side-buttons.component.html',
  styleUrls: ['./outdoor-navigation-side-buttons.component.scss']
})
export class OutdoorNavigationSideButtonsComponent implements OnInit {
  public poiClicked: boolean = false;
  public isDirectionSet: boolean = false;
  public bottomStyle: number = 0;
  private mixedDirectionsType = null;
  public isClassToClass: boolean = false;
  public isClassToBuilding: boolean = false;
  public isBuildingToClass: boolean = false;

  constructor(
    public popoverController: PopoverController,
    private events: Events,
    private geolocationServices: GeolocationServices,
    public modalController: ModalController,
    public directionService: DirectionService,
    private dataSharingService: DataSharingService,
    private directionManager: DirectionsManagerService,
  ) {
    this.directionService.isDirectionSet.subscribe(
      (isDirectionSet: boolean) => {
        this.isDirectionSet = isDirectionSet;
        this.bottomStyle = isDirectionSet ? -7 : 0;

        if(this.directionManager.getMixedType() === MixedDirectionsType.floorToBuilding){
          this.isClassToBuilding = true;
          this.isClassToClass = false;
          this.isBuildingToClass = false;
        } else if(this.directionManager.getMixedType() === MixedDirectionsType.classToClass){
          this.isClassToClass = true;
          this.isClassToBuilding = false;
          this.isBuildingToClass = false;
        } else  if(this.directionManager.getMixedType() === MixedDirectionsType.buildingToFloor){
          this.isClassToClass = false;
          this.isClassToBuilding = false;
          this.isBuildingToClass = true;
        } else {
          this.isClassToBuilding = false;
          this.isClassToClass = false;
          this.isBuildingToClass = false;
        }
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

  async openCalendar() {
    const modal = await this.modalController.create({
      component: CalendarComponent
    })

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

  async centerLocation()
  {
    // this.dataSharingService.updateMessage({
    //   latitude: null,
    //   longitude: null,
    //   mapBounds: null,
    // });
    // this.dataSharingService.updateMessage({
    //   latitude: this.geolocationServices.getLatitude(),
    //   longitude: this.geolocationServices.getLongitude(),
    //   mapBounds: null,
    // });
    this.events.publish('centerLocation', {
      latitude: this.geolocationServices.getLatitude(),
      longitude: this.geolocationServices.getLongitude(),
    });
  }

  public close() {
    this.events.publish('reset-indoor', Date.now());
    this.resetOutdoor();
  }

  public next(){
    this.events.publish('longitude-next-step', true, Date.now());
    this.resetOutdoor();
  }

  private resetOutdoor(){
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
