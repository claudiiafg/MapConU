import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SearchPopoverComponent } from '../search-popover/search-popover.component';
import { PoiPopoverComponent } from '../poi-popover/poi-popover.component';

@Component({
  selector: 'app-outdoor-navigation-side-buttons',
  templateUrl: './outdoor-navigation-side-buttons.component.html',
  styleUrls: ['./outdoor-navigation-side-buttons.component.scss']
})
export class OutdoorNavigationSideButtonsComponent implements OnInit {
  constructor(public popoverController: PopoverController) {}

  ngOnInit() {}

  async presentPopover(ev: any, mode: string) {
    if(mode === 'search'){
      const popover = await this.popoverController.create({
        component: SearchPopoverComponent,
        event: ev,
        translucent: false
      });

      popover.style.cssText = '--width: calc(100% - 10px); top: -230px;';
      return await popover.present();

    } else if(mode === 'poi'){
      const popover = await this.popoverController.create({
        component: PoiPopoverComponent,
        event: ev,
        translucent: false,
      });

      popover.style.cssText = '--width: 200px; top: -30px; left: 25%;';
      return await popover.present();
    }

  }
}
