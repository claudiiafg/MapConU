import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapComponent } from './google-map.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {AlertController, IonicRouteStrategy} from '@ionic/angular';
import {FirestoreSettingsToken} from '@angular/fire/firestore';
import {IonicModule} from '@ionic/angular';
import { Events } from '@ionic/angular';
import {UserServices} from '../../../../services/user.services';
import {PoiServices} from '../../../../services/poi.services';
import {GeolocationServices} from '../../../../services/geolocation.services';
import {DirectionService} from '../../../../services/direction.service';
import {IndoorDirectionsService} from '../../../../services/indoorDirections.service';
import {TranslationService} from "../../../../services/translation.service";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

describe('GoogleMapComponent ', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;
  let service: GeolocationServices = new GeolocationServices( new Geolocation(), new Events(), new AlertController());
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]),
        IonicModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (LanguageLoader),
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ GoogleMapComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        DirectionService,
        IndoorDirectionsService,
        AlertController,
        TranslationService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
        // { provide: GeolocationServices, useClass: MockData }
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

  // New Test for currentLocation
  it('should Mock currentLocation', () => {
    // let tempMarker = {
    //   latitude: Math.random(),
    //   longitude: Math.random()
    // };
    // service.getCurrentPosition();
    component.subscribeToChangeInCurrentPOS();
    expect(component.positionMarkers).toBeDefined();
    expect(component.positionMarkers.length).toBeLessThan(2);
    // expect(service.getLatitude()).toEqual(jasmine.any(Number));
    // expect(service.getLongitude()).toEqual(jasmine.any(Number));
  });

  it('should mock building info', () => {
    // Get all buildings info
    let buildingsInfo: any = component.overlayCoords;

    // Calling alert
    component.showAlert(buildingsInfo[0].name, buildingsInfo[0].address);

    // Checking if the alert is created
    let alert = document.getElementsByClassName("alert-css");
    expect(alert).not.toBeNull();

    // Checking contents of alert are added
    let alertTitle = document.getElementsByClassName("alert-title");
    expect(alertTitle).not.toBeNull();
    let alertSubtitle = document.getElementsByClassName("alert-sub-title");
    expect(alertSubtitle).not.toBeNull();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
