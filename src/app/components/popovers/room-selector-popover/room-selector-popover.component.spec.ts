import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, IonicRouteStrategy, NavParams } from "@ionic/angular";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { RoomSelectorPopoverComponent } from "./room-selector-popover.component";
import { AgmCoreModule } from "@agm/core";
import { APIKey } from "../../../../environments/env";
import { UserServices } from "../../../../services/user.services";
import { PoiServices } from "../../../../services/poi.services";
import { GeolocationServices } from "../../../../services/geolocation.services";
import { DirectionService } from "../../../../services/direction.service";
import {
  IndoorDirectionsService,
  Point
} from "../../../../services/indoorDirections.service";
import { TranslationService } from "../../../../services/translation.service";
import { DirectionsManagerService } from "../../../../services/directionsManager.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NavParamsMock } from "ionic-mocks";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("RoomSelectorPopoverComponent ", () => {
  let component: RoomSelectorPopoverComponent;
  let fixture: ComponentFixture<RoomSelectorPopoverComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        IonicModule.forRoot(),
        AgmCoreModule.forRoot({
          apiKey: APIKey,
          libraries: ["places"],
          apiVersion: "3.31"
        }),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: LanguageLoader,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [RoomSelectorPopoverComponent],
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
        TranslationService,
        DirectionsManagerService,
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
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
  it("should create", () => {
    component.closePopover();
    expect(component).toBeTruthy();
  });

  it("should prettify and look for path", () => {
    let tempComponent = component["events"];
    const mySpy1 = spyOn(component, "lookForPath").and.callThrough();
    const mySpy2 = spyOn(component, "closePopover").and.callThrough();
    const mySpy3 = spyOn(tempComponent, "publish").and.callThrough();
    component["prettyPoints"] = [];
    component["points"].push(
      {
        id: "wc",
        x: 12,
        y: 13
      },
      {
        id: "ne",
        x: 10,
        y: 15
      }
    );
    let result = [
      {
        id: "wc",
        name: "bathroom"
      },
      {
        id: "ne",
        name: "stairs-ne"
      }
    ];
    component["destination"] = "wc";
    component["source"] = "ne";
    component.prettifyTitles();
    expect(component["prettyPoints"]).toEqual(result);
    component.lookForPath();
    expect(component["destination"]).toEqual("wc");
    expect(component["source"]).toEqual("ne");
    expect(mySpy1).toHaveBeenCalled();
    expect(mySpy2).toHaveBeenCalled();
    expect(mySpy3).toHaveBeenCalled();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
