import { AgmCoreModule } from '@agm/core';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
//libraries
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
//env variables
import { APIKey } from 'src/environments/env';
//services
import { GeolocationServices } from 'src/services/geolocationServices';
import { PoiServices } from 'src/services/poiServices';
import { UserServices } from 'src/services/userServices';
import { environment } from '../environments/environment';
//pages
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { IndoorNavigationSideButtonsComponent } from './components/indoor-navigation-side-buttons/indoor-navigation-side-buttons.component';
import { IndoorNavigationToolbarComponent } from './components/indoor-navigation-toolbar/indoor-navigation-toolbar.component';
import { ModalDirectionsComponent } from './components/modal-directions/modal-directions.component';
import { OutdoorNavigationSideButtonsComponent } from './components/outdoor-navigation-side-buttons/outdoor-navigation-side-buttons.component';
import { OutdoorNavigationToolbarComponent } from './components/outdoor-navigation-toolbar/outdoor-navigation-toolbar.component';
import { PoiPopoverComponent } from './components/poi-popover/poi-popover.component';
import { SearchPopoverComponent } from './components/search-popover/search-popover.component';
import { SettingsToolbarComponent } from './components/settings-toolbar/settings-toolbar.component';
import { IndoorMapComponent } from './components/indoor-map/indoor-map.component';
import { OutdoorViewPage } from './pages/outdoor-view/outdoor-view.page';
import { IndoorViewPage } from './pages/indoor-view/indoor-view.page';
import { TimeFooterComponent } from './components/time-footer/time-footer.component';
import { MB1FloorPlan } from './floor-plans/jmsb/mb1/mb1';

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
    MB1FloorPlan,
    OutdoorViewPage,
    IndoorViewPage,
    TimeFooterComponent,
    ModalDirectionsComponent
  ],
  entryComponents: [
    SearchPopoverComponent,
    PoiPopoverComponent,
    ModalDirectionsComponent
  ],
  imports: [
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
    AgmDirectionModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GeolocationServices,
    UserServices,
    PoiServices,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent],
  exports: [
    SearchPopoverComponent,
    IndoorNavigationToolbarComponent,
    ModalDirectionsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
