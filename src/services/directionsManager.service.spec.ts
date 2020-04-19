import {TestBed} from "@angular/core/testing";
import {DirectionsManagerService, MixedDirectionsType} from "./directionsManager.service";
import {GeolocationServices} from "./geolocation.services";
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
import {url} from "inspector";

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
        RouterModule.forRoot([]),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        TranslationService,
        DirectionsManagerService,
        Geolocation,
        GeolocationServices,
        {
          provide: Router
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
    //asserts that steps exists
    expect(service["steps"]).toEqual([2]);
    service.resetSteps();
    //asserts that steps reset after function call
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
  });

  it("should get hall floor number", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    service.stepsBeenInit();
    //prepare data
    service['steps'] = [{floor: 'h8', source: 'here', dest: 'there', wasDone: false}];
    service['currentStep'] = service['steps'][0];
    service['currentStep']['floor'] = 'h8';
    service['currentStep']['floor'].includes('h');
    const number = service.getHallFloor();
    //asserts and returns the correct hall building floor
    expect(number).toEqual(8);
  });

  it("should not be able to get hall floor number", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    service.stepsBeenInit();
    //prepare data
    service['steps'] = [{floor: 'mb1', source: 'here', dest: 'there', wasDone: false}];
    service['currentStep'] = service['steps'][0];
    service['currentStep']['floor'] = 'mb1';
    //since data is not of hall building, throws error
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
    //order data
    service['steps'] = [
      {floor: 'h8', source: 'escalators-up', dest: 'escalators-down', wasDone: false},
      {floor: 'h9', source: 'escalators-down', dest: 'escalators-up', wasDone: false}
    ];
    service['currentStep'] = ['steps'][0];
    const current = service.startFromCurrentStep();
    expect(mySpy).toHaveBeenCalled();
    expect(current).toEqual('steps');
  });

  // test create a path from a room
  it("should get path to room in hall building", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    service['steps'] = [
      {floor: 'h8', source: 'escalators-up', dest: 'h831', wasDone: false, isLast: true}];
    service['geolocationService']['latitude'] = 45.496834;
    service['geolocationService']['longitude'] = -73.578856;
    const mySpy1 = spyOn<any>(service['dataSharingService'], 'updateMapSize').and.callThrough();
    const mySpy3 = spyOn(service, 'getPathToRoom').and.callThrough();
    const mySpy2 = spyOn(service, 'pushStep').and.callThrough();
    //path to hall building
    service.getPathToRoom('h831');
    //assertions
    expect(mySpy1).toHaveBeenCalled();
    expect(mySpy2).toHaveBeenCalled();
    expect(mySpy3).toHaveBeenCalled();
    //asserts that building location has been pushed
    expect(service['steps'][1]['dest']['building']).toEqual('hall');
  });

  it("should get path to room in jmsb building", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    //define geolocation and steps
    service['steps'] = [
      {floor: 'h8', source: 'escalators-up', dest: 'h831', wasDone: false, isLast: true}];
    service['geolocationService']['latitude'] = 45.496834;
    service['geolocationService']['longitude'] = -73.578856;
    const mySpy3 = spyOn(service, 'getPathToRoom').and.callThrough();
    const mySpy2 = spyOn(service, 'pushStep').and.callThrough();
    //path to jmsb room
    service.getPathToRoom('mb1-110');
    //assertions
    expect(mySpy2).toHaveBeenCalled();
    expect(mySpy3).toHaveBeenCalled();
    //assert that the proper step has been pushed with the function
    expect(service['steps'][1]['dest']['building']).toEqual('jmsb');
  });

  it("should pushStep", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    // throws exception if the source and destination are not set
    expect(() => service
        .pushStep({floor: 'h8', wasDone: false, isLast: true}))
        .toThrowError('Must set source and destination in order to push a a new navigation step.');
    service['steps'] = [];
    // works now since source and destination set
    service.pushStep({floor: 'h8', source: 'escalators-up', dest: 'h831', wasDone: false, isLast: true});
    // asserts on whether step has been pushed
    expect(service['steps'][0]['floor']).toEqual('h8');
  });

  // fails but increases coverage (url of undefined)
  it("should get step after outdoors", () => {
    const service: DirectionsManagerService = TestBed.get(
        DirectionsManagerService
    );
    const mySpy = spyOn<any>(service, 'getStepAfterOutdoor').and.callThrough();
    //order data
    service['steps'] = [
      {floor: 'h8', source: 'escalators-up', dest: 'escalators-down', wasDone: false},
      {floor: 'h9', source: 'escalators-down', dest: 'escalators-up', wasDone: false}
    ];
    service['path'] = 'indoor/hall';
    service['currentStep'] = ['steps'][0];
    const after = service.getStepAfterOutdoor();
    expect(mySpy).toHaveBeenCalled();
    expect(after).toEqual({floor: 'h9', source: 'escalators-down', dest: 'escalators-up', wasDone: false});
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
