import {
  Component,
  OnInit,
  AfterViewInit,
  NgZone,
  ElementRef,
  ViewChild
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MapsAPILoader } from '@agm/core';
import { SearchService } from 'src/services/search.service';

@Component({
  selector: 'app-poi-popover',
  templateUrl: './poi-popover.component.html',
  styleUrls: ['./poi-popover.component.scss']
})
export class PoiPopoverComponent implements OnInit, AfterViewInit {

  constructor(
    public popoverController: PopoverController,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public searchService: SearchService
  ) {}


  ngOnInit() {}

  ngAfterViewInit() {}

  findAdress() {}

  async closePopover() {
    await this.popoverController.dismiss();
  }

  public updateMap() {

  }
}
