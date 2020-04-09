import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { IonicRouteStrategy } from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { IndoorMapComponent } from "./indoor-map.component";
import { UserServices } from "../../../../services/user.services";
import { PoiServices } from "../../../../services/poi.services";
import { GeolocationServices } from "../../../../services/geolocation.services";
import { DirectionsManagerService } from "../../../../services/directionsManager.service";
import { TranslationService } from "../../../../services/translation.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Point } from "src/services/indoorDirections.service";
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("IndoorMapComponent ", () => {
  let component: IndoorMapComponent;
  let fixture: ComponentFixture<IndoorMapComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: LanguageLoader,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [IndoorMapComponent],
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
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(IndoorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
  });
  it("should ngAfterViewInit", () => {
    const spyIn = spyOn(component, "subscribeToshowToa");
    component.ngAfterViewInit();
    expect(spyIn).toHaveBeenCalled();
  });
  it("should initNav() without point and invalid name", () => {
    console.log = jasmine.createSpy("Point not available.");
    component["initNav"]("invalidname");
    expect(console.log).toHaveBeenCalledWith("Point not available.");
    expect(component["isSelectMode"]).toBeFalsy();
  });
  it("should initNav() without point and valid name mb", () => {
    console.log = jasmine.createSpy("Point not available.");
    component["initNav"]("invalidname");
    expect(console.log).toHaveBeenCalledWith("Point not available.");
    expect(component["isSelectMode"]).toBeFalsy();
  });
  it("should initNav() without point and valid name mb valid point isSelectMode", () => {
    component["inputBuilding"] = "hall";
    let point: Point[];
    point = [
      {
        id: "mb",
        x: 123,
        y: 123
      }
    ];
    component["inputBuilding"] = "jmsb";
    spyOn(
      component["indoorDirectionsService"],
      "getPointByName"
    ).and.callThrough();
    spyOn(component["interestPoints"], "filter").and.callFake(() => {
      return point;
    });

    component["inputBuilding"] = "hall";
    component["floor"] = 9;
    component["isSelectMode"] = false;
    spyOn(component["directionManager"], "getIsSelectMode").and.callFake(() => {
      return true;
    });
    spyOn(
      component["directionManager"],
      "initDifferentFloorDir"
    ).and.callThrough();
    component["initNav"]("escalator-down");
    expect(component["isSelectMode"]).toBeTruthy();
    expect(
      component["directionManager"].initDifferentFloorDir
    ).toHaveBeenCalled();
  });
  it("should initNav() without point and valid name escalator up", () => {
    console.log = jasmine.createSpy("Point not available.");
    component["initNav"]("invalidname");
    expect(console.log).toHaveBeenCalledWith("Point not available.");
  });

  it("should initNav() without point and valid name escalator down", () => {
    console.log = jasmine.createSpy("Point not available.");
    component["initNav"]("invalidname");
    expect(console.log).toHaveBeenCalledWith("Point not available.");
  });
  it("should setMarker(point)", () => {
    component["marker"] = document.createElement("image");
    component["marker"].setAttribute("x", "50");
    component["marker"].setAttribute("y", "50");
    component["marker"].setAttribute("id", "marker");
    component["marker"].setAttribute(
      "href",
      "../../../../assets/icon/logo_as_marker.png"
    );
    component["marker"].setAttribute("height", "50");
    component["marker"].setAttribute("width", "50");
    let point: Point;
    point = {
      id: "wc",
      x: 27,
      y: 27
    };
    component["setMarker"](point);
    expect(component["marker"].getAttribute("x")).toEqual("1");
    expect(component["marker"].getAttribute("y")).toEqual("1");
    expect(component["marker"].style.visibility).toEqual("visible");
  });
  it("should resetNav()", () => {
    component["foundPath"] = true;
    // component["setMap"]();
    component["resetNav"]();
    // foundPath is reset and should be false
    expect(component["foundPath"]).toBeFalsy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
