import { Component, OnInit } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Events, PopoverController } from '@ionic/angular';
import { PoiPopoverComponent } from '../poi-popover/poi-popover.component';
import { SearchPopoverComponent } from '../search-popover/search-popover.component';

@Component({
  selector: 'app-outdoor-navigation-side-buttons',
  templateUrl: './outdoor-navigation-side-buttons.component.html',
  styleUrls: ['./outdoor-navigation-side-buttons.component.scss']
})
export class OutdoorNavigationSideButtonsComponent implements OnInit {
  public poiClicked: boolean = false;

  constructor(
    public popoverController: PopoverController,
    private events: Events,
    private photoViewer: PhotoViewer,
    private file: File
  ) {}

  ngOnInit() {}

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
  async displayPic(ev: any)
  {
    console.log(this.file.listDir(this.file.applicationDirectory, 'www/assets'));
    console.log(this.file.listDir(this.file.applicationDirectory, 'www/assets/floor-plans'));
    console.log(this.file.checkFile(this.file.applicationDirectory + 'www/assets/floor-plans/', 'Hall-8.svg'));
    // var options = {
    //   share: true, // default is false
    //   closeButton: false, // iOS only: default is true
    //   copyToReference: true // iOS only: default is false
    //   };
    this.photoViewer.show(this.file.applicationDirectory + 'www/assets/floor-plans/Hall-8.svg', 'Hall-8');
  }
}
