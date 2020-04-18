import {TestBed} from "@angular/core/testing";
import {DirectionsManagerService} from "./directionsManager.service";
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
import {RouterTestingModule} from "@angular/router/testing";

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
  let router: Router;

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
        RouterModule.forRoot([]),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        TranslationService,
        DirectionsManagerService,
        Geolocation,
        GeolocationServices,
        {
          provide: Router, useClass: class {
            navigate = jasmine.createSpy("navigateByUrl");
          }
        },
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
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
    router = TestBed.get(Router);
    service['events']['publish']('map-set', Date.now());
    service['events']['publish']('map-set', {
      building: 'jmsb',
      floor: 'mb1'
    }, Date.now());
    service.isIndoorInRoute = new BehaviorSubject(true);
    service.isMixedInRoute = new BehaviorSubject(true);
    const data = {source: 'here', destination: 'there'};
    service['events']['publish']('init-new-path', data, Date.now());
    service['pathHasBeenInit'] = true;
    service.stepsBeenInit();
    service['steps'] = [{floor: 'mb1', source: 'here', dest: 'there', wasDone: false}];
    const mySpy = spyOn<any>(service, 'subscribeToEvents').and.callThrough();
    const mySpy1 = spyOn<any>(service.isMixedInRoute, "subscribe").and.callThrough();
    service['subscribeToEvents']();
    expect(mySpy1).toHaveBeenCalled();
    expect(mySpy).toHaveBeenCalled();
    //expect(router.navigate).toHaveBeenCalledWith('indoor/jmsb');

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

  it("should get current step", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    service['steps'] = [
      {floor: 'h8', source: 'escalators-up', dest: 'escalators-down', wasDone: true},
      {floor: 'h8', source: 'escalators-down', dest: 'escalators-up', wasDone: true}
    ];
    const current = service.getCurrentStep();
    expect(current).toEqual({floor: 'h8', source: 'escalators-down', dest: 'escalators-up', wasDone: true});
  });

  it("should start from current step", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    const mySpy = spyOn<any>(service, 'startFromCurrentStep').and.callThrough();
    service.isIndoorInRoute = new BehaviorSubject(true);
    router = TestBed.get(Router);
    service['steps'] = [
      {floor: 'h8', source: 'escalators-up', dest: 'escalators-down', wasDone: false},
      {floor: 'h9', source: 'escalators-down', dest: 'escalators-up', wasDone: false}
    ];
    service['currentStep'] = ['steps'][0];
    const current = service.startFromCurrentStep();
    //expect(router.navigate).toHaveBeenCalledWith('/indoor/hall');
    expect(mySpy).toHaveBeenCalled();
    expect(current).toEqual('steps');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
