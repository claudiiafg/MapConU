import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

//libraries
import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestoreModule,
  FirestoreSettingsToken
} from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from 'agm-overlays';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AgmDirectionModule } from 'agm-direction';

//pages
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { OutdoorNavigationSideButtonsComponent } from './components/outdoor-navigation-side-buttons/outdoor-navigation-side-buttons.component';
import { IndoorNavigationSideButtonsComponent } from './components/indoor-navigation-side-buttons/indoor-navigation-side-buttons.component';
import { OutdoorNavigationToolbarComponent } from './components/outdoor-navigation-toolbar/outdoor-navigation-toolbar.component';
import { SettingsToolbarComponent } from './components/settings-toolbar/settings-toolbar.component';
import { IndoorNavigationToolbarComponent } from './components/indoor-navigation-toolbar/indoor-navigation-toolbar.component';
import { SearchPopoverComponent } from './components/search-popover/search-popover.component';
import { PoiPopoverComponent } from './components/poi-popover/poi-popover.component';
//env variables
import { APIKey } from 'src/environments/env';
import { environment } from '../environments/environment';

//services
import { GeolocationServices } from 'src/services/geolocationServices';
import { UserServices } from 'src/services/userServices';
import { PoiServices } from 'src/services/poiServices';

PoiServices
@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent,
    OutdoorNavigationSideButtonsComponent,
    IndoorNavigationSideButtonsComponent,
    OutdoorNavigationToolbarComponent,
    SearchPopoverComponent,
    PoiPopoverComponent,
    SettingsToolbarComponent,
    IndoorNavigationToolbarComponent
  ],
  entryComponents: [
    SearchPopoverComponent,
    PoiPopoverComponent
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
  exports: [SearchPopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
