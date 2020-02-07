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
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from "agm-overlays"
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AgmDirectionModule } from 'agm-direction';

//pages
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { OutdoorNavigationSideButtonsComponent} from "./components/outdoor-navigation-side-buttons/outdoor-navigation-side-buttons.component";
import { IndoorNavigationSideButtonsComponent} from "./components/indoor-navigation-side-buttons/indoor-navigation-side-buttons.component";
import { OutdoorNavigationToolbarComponent} from "./components/outdoor-navigation-toolbar/outdoor-navigation-toolbar.component";

//env variables
import { APIKey } from 'src/environments/env';
import { environment } from '../environments/environment';

//services
import { GeolocationServices } from 'src/services/geolocationServices';
import { SearchPopoverComponent } from './components/search-popover/search-popover.component';

@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent,
    OutdoorNavigationSideButtonsComponent,
    IndoorNavigationSideButtonsComponent,
    OutdoorNavigationToolbarComponent,
    SearchPopoverComponent
  ],
  entryComponents: [SearchPopoverComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: APIKey,
      libraries: ['places']
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    AgmDirectionModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GeolocationServices,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent],
  exports: [SearchPopoverComponent]
})
export class AppModule {}
