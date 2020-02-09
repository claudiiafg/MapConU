import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SearchPopoverComponent } from '../search-popover/search-popover.component';

@Component({
  selector: 'app-outdoor-navigation-side-buttons',
  templateUrl: './outdoor-navigation-side-buttons.component.html',
  styleUrls: ['./outdoor-navigation-side-buttons.component.scss']
})
export class OutdoorNavigationSideButtonsComponent implements OnInit {
  constructor(public popoverController: PopoverController) {}

  ngOnInit() {}

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SearchPopoverComponent,
      event: ev,
      translucent: true
    });

    return await popover.present();
  }
}
