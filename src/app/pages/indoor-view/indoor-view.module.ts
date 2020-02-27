import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {IndoorViewPageRoutingModule} from "./indoor-view-routing.module";

import {IndoorViewPage} from "./indoor-view.page";
import {IndoorNavigationToolbarComponent} from "../../components/indoor-navigation-toolbar/indoor-navigation-toolbar.component";
import {IndoorNavigationSideButtonsComponent} from "../../components/indoor-navigation-side-buttons/indoor-navigation-side-buttons.component";
import {IndoorMapComponent} from "../../components/indoor-map/indoor-map.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndoorViewPageRoutingModule
  ],
  exports: [IndoorViewPage],
  declarations: [
    IndoorViewPage,
    IndoorNavigationToolbarComponent,
    IndoorNavigationSideButtonsComponent,
    IndoorMapComponent
  ]
})
export class IndoorViewPageModule {
}
