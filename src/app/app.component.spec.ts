import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import {IonicModule, IonicRouteStrategy, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {FirestoreSettingsToken} from '@angular/fire/firestore';
import {UserServices} from '../services/user.services';
import {PoiServices} from '../services/poi.services';
import {GeolocationServices} from '../services/geolocation.services';
import {DirectionService} from '../services/direction.service';
import {IndoorDirectionsService} from '../services/indoorDirections.service';

describe('AppComponent', () => {
  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });

    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]),
          IonicModule.forRoot()],
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        DirectionService,
        IndoorDirectionsService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {}},
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy }
      ]
    }).compileComponents();
  }));

  // it('should create the app', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // });
  //
  // it('should initialize the app', async () => {
  //   TestBed.createComponent(AppComponent);
  //   expect(platformSpy.ready).toHaveBeenCalled();
  //   await platformReadySpy;
  //   expect(statusBarSpy.styleDefault).toHaveBeenCalled();
  //   expect(splashScreenSpy.hide).toHaveBeenCalled();
  // });

  // TODO: add more tests!
});
