import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { IndoorNavigationSideButtonsComponent } from "./indoor-navigation-side-buttons.component";
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
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { By } from "@angular/platform-browser";

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("IndoorNavigationSideButtonsComponent ", () => {
  let component: IndoorNavigationSideButtonsComponent;
  let fixture: ComponentFixture<IndoorNavigationSideButtonsComponent>;
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
      declarations: [IndoorNavigationSideButtonsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(IndoorNavigationSideButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    component.presentPopover();
    component.showInfo();
    component["getData"]();
    expect(component).toBeTruthy();
  });
  it("should test compass button clicked presentPopover()", () => {
    fixture.detectChanges();
    const spyCompass = spyOn(component, "presentPopover");
    let compass = fixture.debugElement.query(By.css("ion-fab.navPopover"));
    compass.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyCompass).toHaveBeenCalled();
  });
  it("should test showInfo button clicked showInfo()", () => {
    fixture.detectChanges();
    const spyPin = spyOn(component, "showInfo");
    let information = fixture.debugElement.query(
      By.css("ion-fab-button.informationButton")
    );
    information.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyPin).toHaveBeenCalled();
  });
  it("should getData TRUE isSelectMode", () => {
    component["isSelectMode"] = true;
    expect(component["getData"]()).toEqual("select-source-instruction");
  });
  it("should getData FALSE isSelectMode and FALSE directionsManagerService.isIndoorInRoute", () => {
    component["isSelectMode"] = false;
    expect(component["getData"]()).toEqual("press-on-room-instruction");
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
