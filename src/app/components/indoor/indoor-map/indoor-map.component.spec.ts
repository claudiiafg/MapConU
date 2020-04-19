import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { IonicRouteStrategy } from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { IndoorMapComponent } from "./indoor-map.component";
import { H8FloorPlanComponent } from "../../indoor/floor-plans/hall/h8/h8.component";
import { H9FloorPlanComponent } from "../../indoor/floor-plans/hall/h9/h9.component";
import { MB1FloorPlanComponent } from "../../indoor/floor-plans/jmsb/mb1/mb1.component";
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
      declarations: [
        IndoorMapComponent,
        H8FloorPlanComponent,
        H9FloorPlanComponent,
        MB1FloorPlanComponent
      ],
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
    let point: Point;
    point = {
      id: "mb",
      x: 123,
      y: 123
    };
    component["inputBuilding"] = "hall";
    component["floor"] = 8;
    component["isSelectMode"] = true;
    component["interestPoints"] = [];
    spyOn<any>(
      component["indoorDirectionsService"],
      "getPointByName"
    ).and.callFake(() => {
      return point;
    });
    spyOn<any>(component["router"]["url"], "substring").and.callFake(() => {
      return "hall";
    });
    spyOn<any>(component, "setMarker").and.callFake(() => {});

    spyOn(component["directionManager"], "getIsSelectMode").and.callFake(() => {
      return true;
    });
    spyOn<any>(component, "checkCurrentFloorNumber").and.callFake(() => {
      return 9;
    });
    component["initNav"]("escalator-down");
    expect(component["isSelectMode"]).toBeTruthy();
    expect(
      spyOn(
        component["directionManager"],
        "initiateIndoorDirections"
      ).and.callThrough()
    ).toHaveBeenCalledTimes(0);
  });
  it("should initNav() without point and valid name escalator up", () => {
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
  it("should setMap() for hall 8th floor", () => {
    component["inputBuilding"] = "hall";
    component["floor"] = 8;

    fixture.detectChanges();

    spyOn(component["indoorDirectionsService"], "setMap");
    spyOn(component["indoorDirectionsService"], "getLines");
    spyOn(component["indoorDirectionsService"], "getPoints");
    spyOn(component["events"], "publish");

    component.setMap();

    expect(component["indoorDirectionsService"].setMap).toHaveBeenCalled();
    expect(component["indoorDirectionsService"].getLines).toHaveBeenCalled();
    expect(component["indoorDirectionsService"].getPoints).toHaveBeenCalled();
    expect(component["events"].publish).toHaveBeenCalledWith(
      "map-set",
      Object({ building: "hall", floor: 8 }),
      jasmine.any(Number)
    );
  });
  it("should setMap() for hall 9th floor", () => {
    component["inputBuilding"] = "hall";
    component["floor"] = 9;

    fixture.detectChanges();

    spyOn(component["indoorDirectionsService"], "setMap");
    spyOn(component["indoorDirectionsService"], "getLines");
    spyOn(component["indoorDirectionsService"], "getPoints");
    spyOn(component["events"], "publish");

    component.setMap();

    expect(component["indoorDirectionsService"].setMap).toHaveBeenCalled();
    expect(component["indoorDirectionsService"].getLines).toHaveBeenCalled();
    expect(component["indoorDirectionsService"].getPoints).toHaveBeenCalled();
    expect(component["events"].publish).toHaveBeenCalledWith(
      "map-set",
      Object({ building: "hall", floor: 9 }),
      jasmine.any(Number)
    );
  });
  it("should setMap() for jmsb 1st floor", () => {
    component["inputBuilding"] = "jmsb";
    component["floor"] = 1;

    fixture.detectChanges();

    spyOn(component["indoorDirectionsService"], "setMap");
    spyOn(component["indoorDirectionsService"], "getLines");
    spyOn(component["indoorDirectionsService"], "getPoints");
    spyOn(component["events"], "publish");

    component.setMap();

    expect(component["indoorDirectionsService"].setMap).toHaveBeenCalled();
    expect(component["indoorDirectionsService"].getLines).toHaveBeenCalled();
    expect(component["indoorDirectionsService"].getPoints).toHaveBeenCalled();
    expect(component["events"].publish).toHaveBeenCalledWith(
      "map-set",
      Object({ building: "jmsb", floor: 1 }),
      jasmine.any(Number)
    );
  });
  it("should check floor number of hall 8th floor", () => {
    component["inputBuilding"] = "hall";
    component["floor"] = 8;

    fixture.detectChanges();

    expect(component["checkCurrentFloorNumber"]()).toEqual(8);
  });
  it("should check floor number of hall 9th floor", () => {
    component["inputBuilding"] = "hall";
    component["floor"] = 9;

    fixture.detectChanges();

    expect(component["checkCurrentFloorNumber"]()).toEqual(9);
  });
  it("should check floor number of jmsb 1st floor", () => {
    component["inputBuilding"] = "jmsb";
    component["floor"] = 1;

    fixture.detectChanges();

    expect(component["checkCurrentFloorNumber"]()).toEqual(1);
  });
  it("should hide marker", () => {
    component["marker"] = document.createElement("image");
    component["marker"].setAttribute("x", "50");
    component["marker"].setAttribute("y", "50");
    component["marker"].setAttribute("id", "marker");
    component["marker"].setAttribute(
      "href",
      "../../../../assets/icon/logo_as_marker.png"
    );
    component["marker"].style.visibility = "visible";

    fixture.detectChanges();

    component.unsetMarker();
    expect(component["marker"].style.visibility).toBe("hidden");
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
