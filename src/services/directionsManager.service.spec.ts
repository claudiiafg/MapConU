import { TestBed } from "@angular/core/testing";
import { DirectionsManagerService } from "./directionsManager.service";
import { GeolocationServices } from "./geolocation.services";
import { TranslationService } from "./translation.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { RouteReuseStrategy } from "@angular/router";
import { IonicRouteStrategy } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  PreloadAllModules,
  Router,
  RouterModule,
  Routes
} from "@angular/router";
import {BehaviorSubject} from "rxjs";

// import { IndoorViewPage } from "src/app/pages/indoor-view/indoor-view.page";
// import { OutdoorViewPage } from "src/app/pages/outdoor-view/outdoor-view.page";
// import { SettingsPage } from "src/app/pages/settings/settings.page";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

// const routes: Routes = [
//   { path: "outdoor", component: OutdoorViewPage },
//   { path: "outdoor/isMixedNav/:id", component: OutdoorViewPage },
//   { path: "indoor/:id", component: IndoorViewPage },
//   { path: "appSettings", component: SettingsPage },
//
//   //redirect to outdoor if path is not recognized
//   { path: "**", redirectTo: "outdoor" }
// ];

describe("DirectionsManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: LanguageLoader,
            deps: [HttpClient]
          }
        }),
        RouterModule.forRoot([])
      ],
      providers: [
        TranslationService,
        DirectionsManagerService,
        Geolocation,
        GeolocationServices,
        { provide: Router },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
      ]
    }).compileComponents();
  });

  it("should be created", () => {
    const service: DirectionsManagerService = TestBed.get(
      DirectionsManagerService
    );
    expect(service).toBeTruthy();
  });

  it("should reset steps", () => {
    const service: DirectionsManagerService = TestBed.get(
      DirectionsManagerService
    );
    service["steps"] = [2];
    expect(service["steps"]).toEqual([2]);
    service.resetSteps();
    expect(service["steps"]).toEqual([]);
  });

  it("should set and get selectmode", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    service.setSelectMode(true);
    service.getIsSelectMode();
    expect(service["isSelectMode"]).toEqual(true);
  });

  it('should subscribe to events', () => {
    const service: DirectionsManagerService = TestBed.get(DirectionsManagerService);
    service.isIndoorInRoute = new BehaviorSubject(true);
    service.isMixedInRoute = new BehaviorSubject(true);
    service.stepsBeenInit();
    const tempService = service['router'];
    service['steps'] = [{floor: 'mb1', source: 'here', dest: 'there', wasDone: false}];
    const mySpy1 = spyOn<any>(service.isMixedInRoute, "subscribe").and.callFake((res => {
          if (res === true) {
            let building;
            //if first step is indoor (has a floor)
            if (service['steps']) {
              building = (service['steps'][0]['floor'] === 'mb1') ? 'jmsb' : 'hall';
            }
            //get building
            service['router']['navigateByUrl']('indoor/' + building);
            return 'indoor/' + building;
          }
        }
    ));
    service['subscribeToEvents']();
    expect(mySpy1).toHaveBeenCalled();
  });

  it("should get hall floor number", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    service.stepsBeenInit();
    service['steps'] = [{floor: 'h8', source: 'here', dest: 'there', wasDone: false}];
    service['currentStep'] = service['steps'][0];
    service['currentStep']['floor'] = 'h8';
    service['currentStep']['floor'].includes('h');
    const number = service.getHallFloor();
    expect(number).toEqual(8);
  });

  it("should not be able to get hall floor number", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    service.stepsBeenInit();
    service['steps'] = [{floor: 'mb1', source: 'here', dest: 'there', wasDone: false}];
    service['currentStep'] = service['steps'][0];
    service['currentStep']['floor'] = 'mb1';
    expect(() => service.getHallFloor()).toThrowError("First step is not in the hall building");
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
