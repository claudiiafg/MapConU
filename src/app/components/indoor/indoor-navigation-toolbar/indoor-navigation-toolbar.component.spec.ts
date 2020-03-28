import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { IonicRouteStrategy } from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { IndoorNavigationToolbarComponent } from "./indoor-navigation-toolbar.component";
import { UserServices } from "../../../../services/user.services";
import { PoiServices } from "../../../../services/poi.services";
import { GeolocationServices } from "../../../../services/geolocation.services";
import { TranslationService } from "../../../../services/translation.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("IndoorNavigationToolbarComponent ", () => {
  let component: IndoorNavigationToolbarComponent;
  let fixture: ComponentFixture<IndoorNavigationToolbarComponent>;
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
      declarations: [IndoorNavigationToolbarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        TranslationService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(IndoorNavigationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    component["goBackOutside"]();
    component["adjustSettings"]();
    expect(component).toBeTruthy();
  });
  it("should ngAfterViewInit() Hall Building", () => {
    component["inputBuilding"] = "hall";
    spyOn(component["translate"], "getTranslation").and.callFake(() => {
      return "Hall Building";
    });
    component.ngAfterViewInit();
    expect(component["translate"].getTranslation).toHaveBeenCalled();
    // default floor for hall
    expect(component["currentFloorIndex"]).toEqual(9);
  });
  // it("should ngAfterViewInit() jmsb", () => {
  //   component["inputBuilding"] = "jmsb";
  //   spyOn(component["translate"], "getTranslation").and.callFake(() => {
  //     return "John Molson Building";
  //   });
  //   component.ngAfterViewInit();
  //   expect(component["translate"].getTranslation).toHaveBeenCalled();
  //   // default floor for jmsb
  //   expect(component["currentFloorIndex"]).toEqual(9);
  // });
  // it("should ngAfterViewInit() fg", () => {
  //   component["inputBuilding"] = "fg";
  //   spyOn(component["translate"], "getTranslation").and.callFake(() => {
  //     return "Faubourg";
  //   });
  //   component.ngAfterViewInit();
  //   expect(component["translate"].getTranslation).toHaveBeenCalled();
  //   // default floor for fg
  //   expect(component["currentFloorIndex"]).toEqual(9);
  // });
  // it("should ngAfterViewInit() richard", () => {
  //   component["inputBuilding"] = "richard";
  //   spyOn(component["translate"], "getTranslation").and.callFake(() => {
  //     return "Richard Grey Renaud Science Complex";
  //   });
  //   component.ngAfterViewInit();
  //   expect(component["translate"].getTranslation).toHaveBeenCalled();
  //   // default floor for richard
  //   expect(component["currentFloorIndex"]).toEqual(9);
  // });
  // it("should ngAfterViewInit() center", () => {
  //   component["inputBuilding"] = "center";
  //   spyOn(component["translate"], "getTranslation").and.callFake(() => {
  //     return "Central Building";
  //   });
  //   component.ngAfterViewInit();
  //   expect(component["translate"].getTranslation).toHaveBeenCalled();
  //   // default floor for center
  //   expect(component["currentFloorIndex"]).toEqual(9);
  // });
  // it("should ngAfterViewInit() hh", () => {
  //   component["inputBuilding"] = "hh";
  //   spyOn(component["translate"], "getTranslation").and.callFake(() => {
  //     return "Higston Hall";
  //   });
  //   component.ngAfterViewInit();
  //   expect(component["translate"].getTranslation).toHaveBeenCalled();
  //   // default floor for hh
  //   expect(component["currentFloorIndex"]).toEqual(9);
  // });
  // it("should ngAfterViewInit() comm", () => {
  //   component["inputBuilding"] = "comm";
  //   spyOn(component["translate"], "getTranslation").and.callFake(() => {
  //     return "Communication Studies and Journalism Building";
  //   });
  //   component.ngAfterViewInit();
  //   expect(component["translate"].getTranslation).toHaveBeenCalled();
  //   // default floor for comm
  //   expect(component["currentFloorIndex"]).toEqual(9);
  // });
  // it("should ngAfterViewInit() varnier", () => {
  //   component["inputBuilding"] = "varnier";
  //   spyOn(component["translate"], "getTranslation").and.callFake(() => {
  //     return "Vanier Extension";
  //   });
  //   component.ngAfterViewInit();
  //   expect(component["translate"].getTranslation).toHaveBeenCalled();
  //   // default floor for varnier
  //   expect(component["currentFloorIndex"]).toEqual(9);
  // });
  it("should changeFloor", () => {
    component["currentFloorIndex"] = 3;
    component["floor"] = 6;
    component["changeFloor"]();
    // + 1 than floor due to array structure of floors
    expect(component["currentFloorIndex"]).toEqual(7);
  });
  it("should moveUpFloor() currentFloorIndex < maxFloorIndex", () => {
    component["currentFloorIndex"] = 8;
    component["isSelectMode"] = true;
    component["maxFloorIndex"] = 12;
    component["moveUpFloor"]();
    expect(component["currentFloorIndex"]).toEqual(9);
  });
  it("should moveUpFloor() currentFloorIndex > maxFloorIndex", () => {
    component["currentFloorIndex"] = 8;
    component["isSelectMode"] = false;
    component["maxFloorIndex"] = 6;
    component["moveUpFloor"]();
    expect(component["currentFloorIndex"]).toEqual(8);
  });
  it("should moveDownFloor() currentFloorIndex > minFloorIndex", () => {
    component["currentFloorIndex"] = 5;
    component["minFloorIndex"] = 1;
    component["moveDownFloor"]();
    expect(component["currentFloorIndex"]).toEqual(4);
  });
  it("should moveDownFloor() currentFloorIndex < minFloorIndex", () => {
    component["currentFloorIndex"] = 2;
    component["minFloorIndex"] = 5;
    component["moveDownFloor"]();
    expect(component["currentFloorIndex"]).toEqual(2);
  });
  it("should goBackOutside() FALSE isSelectMode", () => {
    component["isSelectMode"] = false;
    spyOn(component["router"], "navigateByUrl").and.callFake(() => {
      return null;
    });
    component["goBackOutside"]();
    expect(component["router"].navigateByUrl).toHaveBeenCalledWith("/outdoor");
  });
  it("should goBackOutside() TRUE isSelectMode", () => {
    component["isSelectMode"] = true;
    spyOn(component["events"], "publish").and.callFake(() => {
      return null;
    });
    component["goBackOutside"]();
    expect(component["events"].publish).toHaveBeenCalled();
  });
  it("should adjustSettings()", () => {
    spyOn(component["router"], "navigateByUrl").and.callFake(() => {
      return null;
    });
    component["adjustSettings"]();
    expect(component["router"].navigateByUrl).toHaveBeenCalledWith(
      "/appSettings"
    );
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
