//libraries
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFirestoreModule,
  FirestoreSettingsToken
} from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AgmDirectionModule } from 'agm-direction';
import { AgmOverlays } from 'agm-overlays';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { NgPipesModule } from 'ngx-pipes';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//env variables
import { APIKey } from 'src/environments/env';
import { environment } from '../environments/environment';

//services
import { GeolocationServices } from 'src/services/geolocation.services';
import { IndoorDirectionsService } from 'src/services/indoorDirections.service';
import { DirectionsManagerService } from 'src/services/directionsManager.service';
import { UserServices } from 'src/services/user.services';
import { PoiServices } from 'src/services/poi.services';
import { StringHelperService } from 'src/services/stringHelper.service';
import { DirectionService } from 'src/services/direction.service';
import {TranslationService} from 'src/services/translation.service';
import { DataSharingService } from 'src/services/data-sharing.service';

//pages
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndoorMapComponent } from './components/indoor/indoor-map/indoor-map.component';
import { IndoorNavigationSideButtonsComponent } from './components/indoor/indoor-navigation-side-buttons/indoor-navigation-side-buttons.component';
import { IndoorNavigationToolbarComponent } from './components/indoor/indoor-navigation-toolbar/indoor-navigation-toolbar.component';
import { GoogleMapComponent } from './components/outdoor/google-map/google-map.component';
import { ModalDirectionsComponent } from './components/outdoor/modal-directions/modal-directions.component';
import { OutdoorNavigationSideButtonsComponent } from './components/outdoor/outdoor-navigation-side-buttons/outdoor-navigation-side-buttons.component';
import { OutdoorNavigationToolbarComponent } from './components/outdoor/outdoor-navigation-toolbar/outdoor-navigation-toolbar.component';
import { PoiPopoverComponent } from './components/popovers/poi-popover/poi-popover.component';
import { RoomSelectorPopoverComponent } from './components/popovers/room-selector-popover/room-selector-popover.component';
import { SearchPopoverComponent } from './components/popovers/search-popover/search-popover.component';
import { TimeFooterComponent } from './components/popovers/time-footer/time-footer.component';
import { SettingsToolbarComponent } from './components/settings-toolbar/settings-toolbar.component';
import { IndoorViewPage } from './pages/indoor-view/indoor-view.page';
import { OutdoorViewPage } from './pages/outdoor-view/outdoor-view.page';
import { SettingsPage } from './pages/settings/settings.page';
import { SettingsOptionsComponent } from './components/settings-options/settings-options.component';
import { InfoPopoverComponent } from './components/popovers/info-popover/info-popover.component';

//floor plans
import { MB1FloorPlanComponent } from './components/indoor/floor-plans/jmsb/mb1/mb1.component';
import { H8FloorPlanComponent } from './components/indoor/floor-plans/hall/h8/h8.component';
import { H9FloorPlanComponent } from './components/indoor/floor-plans/hall/h9/h9.component';

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent,
    IndoorMapComponent,
    OutdoorNavigationSideButtonsComponent,
    IndoorNavigationSideButtonsComponent,
    OutdoorNavigationToolbarComponent,
    SearchPopoverComponent,
    PoiPopoverComponent,
    SettingsToolbarComponent,
    IndoorNavigationToolbarComponent,
    MB1FloorPlanComponent,
    H8FloorPlanComponent,
    H9FloorPlanComponent,
    OutdoorViewPage,
    IndoorViewPage,
    SettingsPage,
    TimeFooterComponent,
    ModalDirectionsComponent,
    RoomSelectorPopoverComponent,
    SettingsOptionsComponent,
    InfoPopoverComponent
  ],
  entryComponents: [
    SearchPopoverComponent,
    PoiPopoverComponent,
    ModalDirectionsComponent,
    RoomSelectorPopoverComponent,
    InfoPopoverComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: APIKey,
      libraries: ['places'],
      apiVersion: '3.31'
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    NgxIonicImageViewerModule,
    AgmDirectionModule,
    NgPipesModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GeolocationServices,
    UserServices,
    NgxIonicImageViewerModule,
    PoiServices,
    DataSharingService,
    DirectionService,
    IndoorDirectionsService,
    TranslationService,
    DirectionsManagerService,
    StringHelperService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent],
  exports: [
    SearchPopoverComponent,
    IndoorNavigationToolbarComponent,
    ModalDirectionsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
