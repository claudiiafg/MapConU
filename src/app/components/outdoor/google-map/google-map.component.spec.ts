import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GoogleMapComponent } from "./google-map.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { AlertController, IonicRouteStrategy } from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { IonicModule } from "@ionic/angular";
import { Events } from "@ionic/angular";
import { UserServices } from "../../../../services/user.services";
import { PoiServices } from "../../../../services/poi.services";
import { GeolocationServices } from "../../../../services/geolocation.services";
import { DirectionService } from "../../../../services/direction.service";
import { IndoorDirectionsService } from "../../../../services/indoorDirections.service";
import { TranslationService } from "../../../../services/translation.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import {Buildinginfo} from '../../../../models/buildinginfo';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {DirectionsManagerService} from "../../../../services/directionsManager.service";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("GoogleMapComponent ", () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;
  let service: GeolocationServices = new GeolocationServices(
    new Geolocation(),
    new Events(),
    new AlertController()
  );
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        IonicModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: LanguageLoader,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [GoogleMapComponent],
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
        AlertController,
        TranslationService,
        SQLite,
        SQLitePorter,
        DirectionsManagerService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: FirestoreSettingsToken, useValue: {}}
        // { provide: GeolocationServices, useClass: MockData }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // New Test for currentLocation
  it("should Mock currentLocation", () => {
    component.subscribeToChangeInCurrentPOS();
    expect(component.positionMarkers).toBeDefined();
    expect(component.positionMarkers.length).toBeLessThan(2);
  });

  it("should mock building info", () => {
    // Get all buildings info
    let buildingsInfo: Buildinginfo = {
      name: 'Hall Building',
      address: '1455 De Maisonneeuve Blvd. W.',
      coords: [
        { lat: 45.496836, lng: -73.578858 },
        { lat: 45.497164, lng: -73.579539 },
        { lat: 45.49772, lng: -73.579029 },
        { lat: 45.497385, lng: -73.578348 }
      ]
    };

    // Calling alert
    component.showAlert(buildingsInfo.name, buildingsInfo.address);

    // Checking if the alert is created
    let alert = document.getElementsByClassName("alert-css");
    expect(alert).not.toBeNull();

    // Checking contents of alert are added
    let alertTitle = document.getElementsByClassName("alert-title");
    expect(alertTitle).not.toBeNull();
    let alertSubtitle = document.getElementsByClassName("alert-sub-title");
    expect(alertSubtitle).not.toBeNull();
  });
  it("should set the map on ngOnInit", async () => {
    spyOn(component["db"].platform, "ready");
    spyOn(component["geolocationServices"], "getCurrentPosition");
    spyOn(component, "subscribeToMapSize");
    spyOn(component, "subscribeToTravelMode");
    spyOn(component, "subscribeToChangeInCurrentPOS");
    spyOn(component, "subscribeToChangeInPOI");
    spyOn(component, "subscribeToIndoorDirectionsCompleted");
    spyOn(component, "subscribeToToggleCenterLocation");

    await component.ngOnInit();

    expect(component["db"].platform.ready).toHaveBeenCalled();
    expect(component["geolocationServices"].getCurrentPosition).toHaveBeenCalled();
    expect(component.subscribeToMapSize).toHaveBeenCalled();
    expect(component.subscribeToTravelMode).toHaveBeenCalled();
    expect(component.subscribeToChangeInCurrentPOS).toHaveBeenCalled();
    expect(component.subscribeToChangeInPOI).toHaveBeenCalled();
    expect(component.subscribeToIndoorDirectionsCompleted).toHaveBeenCalled();
    expect(component.subscribeToToggleCenterLocation).toHaveBeenCalled();
  });
  it("should subcribe when indoor direction is completed", async () => {
    spyOn(component["events"], "subscribe");

    component.subscribeToIndoorDirectionsCompleted();

    expect(component["events"].subscribe).toHaveBeenCalledWith("path-completed", jasmine.any(Function));
  });
  it("should subscribe to change in POI", async () => {
    spyOn(component["events"], "subscribe");

    component.subscribeToChangeInPOI();

    expect(component["events"].subscribe).toHaveBeenCalledWith("poi-toggle-changed", jasmine.any(Function));
    expect(component["events"].subscribe).toHaveBeenCalledWith("poi-clicked", jasmine.any(Function));
    expect(component["events"].subscribe).toHaveBeenCalledWith("campusChanged", jasmine.any(Function));
  });
  it("should subscribeToToggleCenterLocation", async () => {
    spyOn(component["events"], "subscribe");

    component.subscribeToToggleCenterLocation();

    expect(component["events"].subscribe).toHaveBeenCalledWith("centerLocation", jasmine.any(Function));
  });
  it("should getIcon for restaurant", () => {
    const poiMarkerIcon = component.getIcon({type: "restaurant"});
    expect(poiMarkerIcon).toEqual({ url: 'assets/icon/Marker_Restaurant.png', scaledSize: Object({ width: 20, height: 20 }) });
  });
  it("should getIcon for coffee shop", () => {
    const poiMarkerIcon = component.getIcon({type: "coffee shop"});
    expect(poiMarkerIcon).toEqual({ url: 'assets/icon/Marker_Coffee.png', scaledSize: Object({ width: 20, height: 20 }) });
  });
  it("should getIcon for gas station", () => {
    const poiMarkerIcon = component.getIcon({type: "gas station"});
    expect(poiMarkerIcon).toEqual({ url: 'assets/icon/Marker_Gas_Station.png', scaledSize: Object({ width: 20, height: 20 }) });
  });
  it("should getIcon for drugstore", () => {
    const poiMarkerIcon = component.getIcon({type: "drugstore"});
    expect(poiMarkerIcon).toEqual({ url: 'assets/icon/Marker_Drugstore.png', scaledSize: Object({ width: 20, height: 20 }) });
  });
  it("should getIcon for hotel", () => {
    const poiMarkerIcon = component.getIcon({type: "hotel"});
    expect(poiMarkerIcon).toEqual({ url: 'assets/icon/Marker_Hotel.png', scaledSize: Object({ width: 20, height: 20 }) });
  });
  it("should getIcon for groceries", () => {
    const poiMarkerIcon = component.getIcon({type: "groceries"});
    expect(poiMarkerIcon).toEqual({ url: 'assets/icon/Marker_Groceries.png', scaledSize: Object({ width: 20, height: 20 }) });
  });
  it("should send message", () => {
    const message = "test";
    spyOn(component["dataSharingService"], "updateMessage");

    component.sendMessage(message);

    expect(component["dataSharingService"].updateMessage).toHaveBeenCalledWith("test");
  });
  it("should send message", () => {
    spyOn(component["dataSharingService"].mapSize, "subscribe");

    component.subscribeToMapSize();

    expect(component["dataSharingService"].mapSize.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
  });
  it("should subscribe to travel mode", () => {
    spyOn(component["directionService"].changeTravelMode, "subscribe");

    component.subscribeToTravelMode();

    expect(component["directionService"].changeTravelMode.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
