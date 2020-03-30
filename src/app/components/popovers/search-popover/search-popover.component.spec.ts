import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import { SearchPopoverComponent } from './search-popover.component';
import { AgmCoreModule } from '@agm/core';
import { APIKey } from '../../../../environments/env';
import { UserServices } from '../../../../services/user.services';
import { PoiServices } from '../../../../services/poi.services';
import { GeolocationServices } from '../../../../services/geolocation.services';
import { DirectionService } from '../../../../services/direction.service';
import { IndoorDirectionsService } from '../../../../services/indoorDirections.service';
import { TranslationService } from '../../../../services/translation.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {BehaviorSubject} from "rxjs";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

describe('SearchPopoverComponent ', () => {
  let component: SearchPopoverComponent;
  let fixture: ComponentFixture<SearchPopoverComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        IonicModule.forRoot(),
        AgmCoreModule.forRoot({
          apiKey: APIKey,
          libraries: ['places'],
          apiVersion: '3.31'
        }),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (LanguageLoader),
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ SearchPopoverComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        DirectionService,
        IndoorDirectionsService,
        TranslationService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    component.ngAfterViewInit();
    component.findAddress();
    component.closePopover();
    component.updateMap();
    expect(component).toBeTruthy();
  });

  it('given no coordinates update map should call get latitude and longitude', () => {
    const tempComp1 = component['geolocationServices'];
    const mySpy = spyOn(tempComp1, 'getLatitude');
    component.updateMap();
    expect(mySpy).toHaveBeenCalled();
  });

  it('given latitudes to and from update map should call updateMapSize', () => {
    component.latitudeTo = 45.99;
    component.latitudeFrom = 45.759;
    const tempComp2 = component['dataSharingService'];
    const mySpy = spyOn(tempComp2, 'updateMapSize');
    component.updateMap();
    expect(mySpy).toHaveBeenCalled();
  });

  it('update map should call close popover', () => {
    const mySpy = spyOn(component, 'closePopover');
    component.updateMap();
    expect(mySpy).toHaveBeenCalled();
  });

  it('all coordinates given, update map should call next and return destination', () => {
    component.latitudeTo = 45.688;
    component.latitudeFrom = 45.758;
    component.longitudeFrom = -74.568;
    component.longitudeTo = -74.610;
    const tempComp2 = component['directionService'];
    const mySpy = spyOn(tempComp2.origin, 'next');
    component.updateMap();
    expect(mySpy).toHaveBeenCalled();
    expect(tempComp2.destination).toEqual(new BehaviorSubject([45.688, -74.610]));
  });

  it('dummy test 1+1', () => {
    const hello = 1;
    expect(hello * 2).toEqual(2);
  });

  // it('dummy test 2+2', () => {
  //   const hello = 2;
  //   expect(hello*2).toEqual(4);
  // });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
