import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { OutdoorNavigationSideButtonsComponent} from "./components/outdoor-navigation-side-buttons/outdoor-navigation-side-buttons.component";
import { IndoorNavigationSideButtonsComponent} from "./components/indoor-navigation-side-buttons/indoor-navigation-side-buttons.component";
import { AgmCoreModule } from '@agm/core';
import { APIKey } from 'src/environments/env';

@NgModule({
  declarations: [AppComponent, GoogleMapComponent, OutdoorNavigationSideButtonsComponent, IndoorNavigationSideButtonsComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: APIKey
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
