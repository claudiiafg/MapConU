import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-search-popover',
  templateUrl: './search-popover.component.html',
  styleUrls: ['./search-popover.component.scss']
})
export class SearchPopoverComponent implements OnInit {
  constructor(public popoverController: PopoverController) {}

  ngOnInit() {}

  async closePopover() {
    await this.popoverController.dismiss();
  }
}
