import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import { RoomSelectorPopoverComponent } from './room-selector-popover.component';
import { AgmCoreModule } from '@agm/core';
import { APIKey } from '../../../../environments/env';
import { UserServices } from '../../../../services/user.services';
import { PoiServices } from '../../../../services/poi.services';
import { GeolocationServices } from '../../../../services/geolocation.services';
import { DirectionService } from '../../../../services/direction.service';
import { IndoorDirectionsService } from '../../../../services/indoorDirections.service';
import {TranslationService} from "../../../../services/translation.service";
import {DirectionsManagerService} from "../../../../services/directionsManager.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

describe('RoomSelectorPopoverComponent ', () => {
  let component: RoomSelectorPopoverComponent;
  let fixture: ComponentFixture<RoomSelectorPopoverComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        IonicModule.forRoot(),
        AgmCoreModule.forRoot({
          apiKey: APIKey,
          libraries: ['places'],
          apiVersion: '3.31'
        }), HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (LanguageLoader),
            deps: [HttpClient]
          }
        })],
      declarations: [ RoomSelectorPopoverComponent ],
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
        DirectionsManagerService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSelectorPopoverComponent);
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
