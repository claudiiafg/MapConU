import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutdoorViewPageRoutingModule } from './outdoor-view-routing.module';

import { OutdoorViewPage } from './outdoor-view.page';
import { OutdoorNavigationToolbarComponent } from '../../components/outdoor-navigation-toolbar/outdoor-navigation-toolbar.component';
import { OutdoorNavigationSideButtonsComponent } from '../../components/outdoor-navigation-side-buttons/outdoor-navigation-side-buttons.component';
import { GoogleMapComponent } from '../../components/google-map/google-map.component';
import { SearchPopoverComponent } from '../../components/search-popover/search-popover.component';
import { PoiPopoverComponent } from '../../components/poi-popover/poi-popover.component';
import { TimeFooterComponent } from 'src/app/components/time-footer/time-footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutdoorViewPageRoutingModule
  ],
  exports: [OutdoorViewPage],
  declarations: [
    OutdoorViewPage,
    OutdoorNavigationToolbarComponent,
    OutdoorNavigationSideButtonsComponent,
    GoogleMapComponent,
    SearchPopoverComponent,
    PoiPopoverComponent,
    TimeFooterComponent
  ]
})
export class OutdoorViewPageModule {}
