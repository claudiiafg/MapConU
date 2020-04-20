import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { IonicRouteStrategy } from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { UserServices } from "../../../services/user.services";
import { PoiServices } from "../../../services/poi.services";
import { GeolocationServices } from "../../../services/geolocation.services";
import { DirectionService } from "../../../services/direction.service";
import { IndoorDirectionsService } from "../../../services/indoorDirections.service";
import { SettingsOptionsComponent } from "./settings-options.component";
import { TranslationService } from "../../../services/translation.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { By } from "@angular/platform-browser";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("SettingsOptionsComponent", () => {
  let component: SettingsOptionsComponent;
  let fixture: ComponentFixture<SettingsOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsOptionsComponent],
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
        NativeStorage,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    component.languageChange();
    component.login();
    component.logout();
    expect(component).toBeTruthy();
  });
  it("should test languageChange() EN", () => {
    fixture.detectChanges();
    const spyPin = spyOn(component, "languageChange");
    let language = fixture.debugElement.query(
      By.css("ion-select.selectLanguageButton")
    );
    language.triggerEventHandler("ionChange", null);
    fixture.detectChanges();
    expect(spyPin).toHaveBeenCalled();
  });
  it("should test login()", () => {
    fixture.detectChanges();
    const spyPin = spyOn(component, "login");
    let login = fixture.debugElement.query(By.css("ion-button.loginButton"));
    login.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyPin).toHaveBeenCalled();
  });
  // cannot test logout without being loggedin
  // login does not work in the browser, missing cordova
  // it("should test logout()", () => {
  //   fixture.detectChanges();
  //   component.login();
  //   const spyPin = spyOn(component, "logout");
  //   let logout = fixture.debugElement.query(By.css("ion-button.logoutButton"));
  //   logout.triggerEventHandler("click", null);
  //   fixture.detectChanges();
  //   expect(spyPin).toHaveBeenCalled();
  // });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
