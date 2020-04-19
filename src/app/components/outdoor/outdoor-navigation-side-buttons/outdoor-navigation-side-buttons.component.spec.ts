import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed
} from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { OutdoorNavigationSideButtonsComponent } from "./outdoor-navigation-side-buttons.component";
import { UserServices } from "../../../../services/user.services";
import { PoiServices } from "../../../../services/poi.services";
import { GeolocationServices } from "../../../../services/geolocation.services";
import { DirectionService } from "../../../../services/direction.service";
import { IndoorDirectionsService } from "../../../../services/indoorDirections.service";
import { TranslationService } from "../../../../services/translation.service";
import { By } from "@angular/platform-browser";
import { DirectionsManagerService } from "../../../../services/directionsManager.service";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslateStore
} from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CalendarComponent } from "../../popovers/calendar/calendar.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { NativeGeocoder } from "@ionic-native/native-geocoder/ngx";

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("OutdoorNavigationSideButtonsComponent ", () => {
  let component: OutdoorNavigationSideButtonsComponent;
  let fixture: ComponentFixture<OutdoorNavigationSideButtonsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        IonicModule.forRoot(),
        HttpClientModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory
        }),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: LanguageLoader,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [OutdoorNavigationSideButtonsComponent, CalendarComponent],
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
        TranslateLoader,
        TranslateModule,
        TranslateService,
        TranslateStore,
        CalendarComponent,
        NativeStorage,
        NativeGeocoder,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [CalendarComponent] }
      })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorNavigationSideButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    component.openViewer();
    component.presentPopover(null, null);
    component.close();
    expect(component).toBeTruthy();
  });

  it("test poi toggle", () => {
    fixture.detectChanges();
    fixture.debugElement.triggerEventHandler("click", "pin");
    expect(component.presentPopover("click", "poi")).toBeTruthy();
  });

  it("test open poi toggle", () => {
    component.poiClicked = false;
    fixture.detectChanges();
    const spyPin = spyOn(component, "presentPopover");
    let pin = fixture.debugElement.query(By.css("ion-icon.pinButton"));
    pin.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyPin).toHaveBeenCalled();
  });

  it("test close poi toggle", () => {
    component.poiClicked = true;
    fixture.detectChanges();
    const spyClose = spyOn(component, "presentPopover");
    let close = fixture.debugElement.query(By.css("ion-icon.closeButton"));
    close.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyClose).toHaveBeenCalled();
  });

  it("test open bus schedule", () => {
    component.poiClicked = true;
    fixture.detectChanges();
    const spyBus = spyOn(component, "openViewer");
    let bus = fixture.debugElement.query(By.css("ion-icon.busButton"));
    bus.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyBus).toHaveBeenCalled();
  });

  it("test close direction button", () => {
    component.isDirectionSet = true;
    fixture.detectChanges();
    const spyDirectionClose = spyOn(component, "close");
    let directionClose = fixture.debugElement.query(
      By.css("ion-fab-button.directionCloseButton")
    );
    directionClose.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyDirectionClose).toHaveBeenCalled();
  });

  it("should set up component on init", () => {
    spyOn(component["events"], "subscribe");
    component.ngOnInit();
    expect(component["events"].subscribe).toHaveBeenCalledWith(
      "poi-selected",
      jasmine.any(Function)
    );
    expect(component["events"].subscribe).toHaveBeenCalledWith(
      "poi-unselected",
      jasmine.any(Function)
    );
  });

  it("should display the calendar", async () => {
    fixture.detectChanges();
    spyOn(component["modalController"], "create");

    component.openCalendar();

    expect(component["modalController"].create).toHaveBeenCalledWith({
      component: CalendarComponent
    });
  });

  it("should call next", () => {
    spyOn(component["events"], "publish");

    component.next();

    expect(component["events"].publish).toHaveBeenCalledWith(
      "get-next-step",
      true,
      jasmine.any(Number)
    );
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
