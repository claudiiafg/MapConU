import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {IonicModule, IonicRouteStrategy, Platform} from '@ionic/angular';
import {FirestoreSettingsToken} from '@angular/fire/firestore';
import {OutdoorNavigationToolbarComponent} from './outdoor-navigation-toolbar.component';
import {GoogleMapComponent} from '../google-map/google-map.component';
import { Event } from "@angular/router";
import anything = jasmine.anything;
import {UserServices} from '../../../../services/user.services';
import {PoiServices} from '../../../../services/poi.services';
import {DataSharingService} from '../../../../services/data-sharing.service';
import {GeolocationServices} from '../../../../services/geolocation.services';

describe('OutdoorNavigationToolbarComponent ', () => {
  let component: OutdoorNavigationToolbarComponent;
  let fixture: ComponentFixture<OutdoorNavigationToolbarComponent>;

  let googleMapcomponent: GoogleMapComponent;
  let googleFixture: ComponentFixture<GoogleMapComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]),
      ],
      declarations: [ OutdoorNavigationToolbarComponent,
        GoogleMapComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        GoogleMapComponent,
        UserServices,
        DataSharingService,
        PoiServices,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorNavigationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // send message function
  it('sendMessage() changes message', () => {
    fixture.detectChanges();
    component.ngOnInit();

    component.loc = '1';
    component.locations = [
      { latitude: 45.495729, longitude: -73.578041 },
      { latitude: 45.45824, longitude: -73.640452 }
    ];
    expect(component.loc).toEqual('1');
    component.message = 'clicking';
    expect(component.message).toEqual('clicking');
    component.sendMessage('testing');
    expect(component.message).toEqual('testing');
    component.loc = '0';
    component.changeCampus();
    const sendMessageSpy = spyOn(component, 'changeCampus');
    expect(sendMessageSpy.calls.count()).toEqual(0);
    expect(component.changeCampus()).toBeUndefined();
  })

  it('test campus toggle functions', () => {

    googleFixture = TestBed.createComponent(GoogleMapComponent);
    googleMapcomponent = googleFixture.componentInstance;
    googleFixture.detectChanges();

    expect(googleMapcomponent).toBeTruthy();
    expect(googleMapcomponent.latitude).toBe(45.495729);
    expect(googleMapcomponent.longitude).toBe(-73.578041);
    component.loc = "1";
    component.changeCampus();
    googleMapcomponent.subscribeToChangeInCurrentPOS();
    expect(googleMapcomponent.latitude).toBe(45.45824);
    expect(googleMapcomponent.longitude).toBe(-73.640452);
    });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
