import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {IonicRouteStrategy} from '@ionic/angular';
import {FirestoreSettingsToken} from '@angular/fire/firestore';
import {IndoorMapComponent} from './indoor-map.component';
import {UserServices} from '../../../../services/user.services';
import {PoiServices} from '../../../../services/poi.services';
import {GeolocationServices} from '../../../../services/geolocation.services';


describe('IndoorMapComponent ', () => {
  let component: IndoorMapComponent;
  let fixture: ComponentFixture<IndoorMapComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [ IndoorMapComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: FirestoreSettingsToken, useValue: {}}
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(IndoorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
