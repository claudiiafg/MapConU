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
import { DeviceDetectorService } from "ngx-device-detector";
import { TranslationService } from "../../../../services/translation.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { By } from "@angular/platform-browser";
import { DirectionsManagerService } from "../../../../services/directionsManager.service";
import { SQLite } from "@ionic-native/sqlite/ngx";
import { SQLitePorter } from "@ionic-native/sqlite-porter/ngx";
import { SpeechRecognition } from "@ionic-native/speech-recognition/ngx";

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
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
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
        DirectionsManagerService,
        SQLite,
        SQLitePorter,
        SpeechRecognition,
        DeviceDetectorService,
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
    component.moveToFoundLocation(45, -73, 100);
    // component.closeAutocomplete(null);
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

  it("test click changeTravelMode walk", () => {
    component.isDirectionSet = true;
    fixture.detectChanges();
    const spyWalk = spyOn(component, "changeTravelMode");
    let walk = fixture.debugElement.query(By.css("ion-button.walkButton"));
    walk.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyWalk).toHaveBeenCalled();
  });

  it("test click changeTravelMode transit", () => {
    component.isDirectionSet = true;
    fixture.detectChanges();
    const spyTransit = spyOn(component, "changeTravelMode");
    let transit = fixture.debugElement.query(
      By.css("ion-button.transitButton")
    );
    transit.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyTransit).toHaveBeenCalled();
  });

  it("test click changeTravelMode car", () => {
    component.isDirectionSet = true;
    fixture.detectChanges();
    const spyDirectionClose = spyOn(component, "changeTravelMode");
    let directionClose = fixture.debugElement.query(
      By.css("ion-button.driveButton")
    );
    directionClose.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyDirectionClose).toHaveBeenCalled();
  });

  // it("test closeAutocomplete", () => {
  //   fixture.detectChanges();
  //   const spySearch = spyOn(component, "closeAutocomplete");
  //   let search = fixture.debugElement.query(
  //     By.css("ion-searchbar.searchButton")
  //   );
  //   search.triggerEventHandler("ionClear", null);
  //   fixture.detectChanges();
  //   expect(spySearch).toHaveBeenCalled();
  // });

  it("should move to found location", () => {
    expect(googleMapcomponent.latitude).toBe(45.495729);
    expect(googleMapcomponent.longitude).toBe(-73.578041);
    const lat = 45.494828;
    const lng = -73.577981;
    component.moveToFoundLocation(lat, lng, 100);
    fixture.detectChanges();
    googleMapcomponent.subscribeToChangeInCurrentPOS();
    expect(googleMapcomponent.latitude).toBe(45.494828);
    expect(googleMapcomponent.longitude).toBe(-73.577981);
  });

  it("should adjustSettings()", () => {
    spyOn(component["router"], "navigateByUrl").and.callThrough();
    component["adjustSettings"]();
    expect(component["router"].navigateByUrl).toHaveBeenCalledWith(
      "/appSettings"
    );
  });

  it("should test set selected colour", () => {
    component.setSelectedColor("DRIVING");
    expect(component.transitColor).toEqual("white");
    expect(component.walkColor).toEqual("white");
    expect(component.carColor).toEqual("yellow");
    component.setSelectedColor("TRANSIT");
    expect(component.transitColor).toEqual("yellow");
    expect(component.carColor).toEqual("white");
    expect(component.walkColor).toEqual("white");
    component.setSelectedColor("PLANE");
    expect(component.transitColor).toEqual("white");
    expect(component.carColor).toEqual("white");
    expect(component.walkColor).toEqual("yellow");
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
