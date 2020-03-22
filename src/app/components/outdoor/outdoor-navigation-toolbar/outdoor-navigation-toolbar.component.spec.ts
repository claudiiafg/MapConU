import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { IonicModule, IonicRouteStrategy, Platform } from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { OutdoorNavigationToolbarComponent } from "./outdoor-navigation-toolbar.component";
import { GoogleMapComponent } from "../google-map/google-map.component";
import { UserServices } from "../../../../services/user.services";
import { PoiServices } from "../../../../services/poi.services";
import { DataSharingService } from "../../../../services/data-sharing.service";
import { GeolocationServices } from "../../../../services/geolocation.services";
import { DirectionService } from "../../../../services/direction.service";
import { IndoorDirectionsService } from "../../../../services/indoorDirections.service";
import { AgmDirectionModule } from "agm-direction";
import { AgmOverlays } from "agm-overlays";
import { AgmCoreModule } from "@agm/core";
import { APIKey } from "../../../../environments/env";
import { TranslationService } from "../../../../services/translation.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}
describe("OutdoorNavigationToolbarComponent ", () => {
  let component: OutdoorNavigationToolbarComponent;
  let fixture: ComponentFixture<OutdoorNavigationToolbarComponent>;

  let googleMapcomponent: GoogleMapComponent;
  let googleFixture: ComponentFixture<GoogleMapComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        IonicModule.forRoot(),
        AgmOverlays,
        AgmCoreModule.forRoot({
          apiKey: APIKey,
          libraries: ["places"],
          apiVersion: "3.31"
        }),
        AgmDirectionModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: LanguageLoader,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [OutdoorNavigationToolbarComponent, GoogleMapComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        GoogleMapComponent,
        UserServices,
        DataSharingService,
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
    fixture = TestBed.createComponent(OutdoorNavigationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    googleFixture = TestBed.createComponent(GoogleMapComponent);
    googleMapcomponent = googleFixture.componentInstance;
    googleFixture.detectChanges();
  });
  it("should create", () => {
    component.findAddress();
    component.changeCampus();
    component.moveToFoundLocation(45, -73);
    component.closeAutocomplete(null);
    component.changeTravelMode("TRANSIT");
    component.setSelectedColor("TRANSIT");
    component.adjustSettings();
    expect(component).toBeTruthy();
    expect(googleMapcomponent).toBeTruthy();
  });

  // send message function
  it("sendMessage() changes message", () => {
    component.loc = "1";
    component.locations = [
      { latitude: 45.495729, longitude: -73.578041 },
      { latitude: 45.45824, longitude: -73.640452 }
    ];
    expect(component.loc).toEqual("1");
    component.message = "clicking";
    expect(component.message).toEqual("clicking");
    component.message = "testing";
    expect(component.message).toEqual("testing");
  });

  it("test campus toggle functions", () => {
    expect(googleMapcomponent.latitude).toBe(45.495729);
    expect(googleMapcomponent.longitude).toBe(-73.578041);
    component.loc = "1";
    component.changeCampus();
    googleMapcomponent.subscribeToChangeInCurrentPOS();
    expect(googleMapcomponent.latitude).toBe(45.45824);
    expect(googleMapcomponent.longitude).toBe(-73.640452);
  });

  it("test changeTravelMode", () => {
    const travelMode = "DRIVING";
    component.changeTravelMode(travelMode);
    component.setSelectedColor(travelMode);
    expect(component.carColor).toBe("yellow");
    component.changeTravelMode("WALKING");
    component.setSelectedColor("WALKING");
    expect(component.carColor).toBe("white");
    expect(component.walkColor).toBe("yellow");
    googleMapcomponent.subscribeToTravelMode();
    expect(googleMapcomponent.travelMode).toBe("WALKING");
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
