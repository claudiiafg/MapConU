//libraries
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFirestoreModule,
  FirestoreSettingsToken
} from '@angular/fire/firestore';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmOverlays } from 'agm-overlays';
import { NgPipesModule } from 'ngx-pipes';

//env variables
import { APIKey } from 'src/environments/env';
import { environment } from '../environments/environment';

//pages
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapComponent } from './components/outdoor/google-map/google-map.component';
import { IndoorNavigationSideButtonsComponent } from './components/indoor/indoor-navigation-side-buttons/indoor-navigation-side-buttons.component';
import { IndoorNavigationToolbarComponent } from './components/indoor/indoor-navigation-toolbar/indoor-navigation-toolbar.component';
import { ModalDirectionsComponent } from './components/outdoor/modal-directions/modal-directions.component';
import { OutdoorNavigationSideButtonsComponent } from './components/outdoor/outdoor-navigation-side-buttons/outdoor-navigation-side-buttons.component';
import { OutdoorNavigationToolbarComponent } from './components/outdoor/outdoor-navigation-toolbar/outdoor-navigation-toolbar.component';
import { PoiPopoverComponent } from './components/popovers/poi-popover/poi-popover.component';
import { SearchPopoverComponent } from './components/popovers/search-popover/search-popover.component';
import { SettingsToolbarComponent } from './components/settings-toolbar/settings-toolbar.component';
import { IndoorMapComponent } from './components/indoor/indoor-map/indoor-map.component';
import { OutdoorViewPage } from './pages/outdoor-view/outdoor-view.page';
import { IndoorViewPage } from './pages/indoor-view/indoor-view.page';
import { TimeFooterComponent } from './components/popovers/time-footer/time-footer.component';

//services
import { GeolocationServices } from 'src/services/geolocationServices';
import { UserServices } from 'src/services/userServices';
import { PoiServices } from '../services/poiServices';
import { IndoorDirectionsService } from 'src/services/indoorDirectionsService';

//floor plans
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
    AgmDirectionModule,
    NgPipesModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GeolocationServices,
    UserServices,
    PoiServices,
    IndoorDirectionsService,
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
