import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapComponent } from './google-map.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {GeolocationServices} from '../../../services/geolocationServices';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {PoiServices} from '../../../services/poiServices';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {UserServices} from '../../../services/userServices';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {IonicRouteStrategy} from '@ionic/angular';
import {FirestoreSettingsToken} from '@angular/fire/firestore';

describe('GoogleMapComponent ', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [ GoogleMapComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

