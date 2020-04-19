import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { NavParams } from "@ionic/angular";
import { NavParamsMock } from "ionic-mocks";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";

import { UserServices } from "../../../../services/user.services";
import { PoiServices } from "../../../../services/poi.services";
import { GeolocationServices } from "../../../../services/geolocation.services";
import { DirectionsManagerService } from "../../../../services/directionsManager.service";
import { TranslationService } from "../../../../services/translation.service";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslateStore
} from "@ngx-translate/core";

import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { NativeGeocoder } from "@ionic-native/native-geocoder/ngx";

import { DisplayCalendarsPopoverComponent } from "./display-calendars-popover.component";

describe("DisplayCalendarsPopoverComponent", () => {
  let component: DisplayCalendarsPopoverComponent;
  let fixture: ComponentFixture<DisplayCalendarsPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayCalendarsPopoverComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        DirectionsManagerService,
        TranslationService,
        TranslateLoader,
        TranslateModule,
        TranslateService,
        TranslateStore,
        NativeStorage,
        NativeGeocoder,
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayCalendarsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
