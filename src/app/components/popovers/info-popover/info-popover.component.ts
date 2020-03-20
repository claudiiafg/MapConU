import { Component } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-info-popover',
  templateUrl: './info-popover.component.html',
  styleUrls: ['./info-popover.component.scss']
})
export class InfoPopoverComponent {
  private data: string = '';

  constructor(
    private popoverController: PopoverController,
    private navParams: NavParams
  ) {
    if (this.navParams.get('data')) {
      this.data = this.navParams.get('data');
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.closePopover();
    }, 2000);
  }

  closePopover() {
    this.popoverController.dismiss();
  }
}
