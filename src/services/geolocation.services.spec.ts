import { TestBed } from "@angular/core/testing";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { GeolocationServices } from "./geolocation.services";

describe("GeolocationServices", () => {
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
    TestBed.configureTestingModule({
      providers: [Geolocation, GeolocationServices]
    }).compileComponents();
  });

  it("should be created", () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    expect(service).toBeTruthy();
  });

  it("should get current position", () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    service["latitude"] = 45.494828;
    service["longitude"] = -73.577981;
    const mySpy = spyOn<any>(service, "getCurrentPosition")
      .and.returnValue(true)
      .and.callThrough();
    service.getCurrentPosition();
    expect(mySpy).toHaveBeenCalled();
    expect(service.latitude).toEqual(45.494828);
    expect(service.longitude).toEqual(-73.577981);
  });

  // it("should get coordinates", () => {
  //   const service: GeolocationServices = TestBed.get(GeolocationServices);
  //   service["latitude"] = 45.494828;
  //   service["longitude"] = -73.577981;
  //   const mySpy = spyOn<any>(service, "getCoordinates").and.callThrough();
  //   service.getCoordinates();
  //   expect(mySpy).toHaveBeenCalled();
  //   expect(service.latitude).toEqual(45.494828);
  //   expect(service.longitude).toEqual(-73.577981);
  // });

  // merge above test inside this due to runtime error with too many tests
  it("should get lat and long and coordinates", () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    service["latitude"] = 45.494828;
    service["longitude"] = -73.577981;
    const latSpy = spyOn<any>(service, "getLatitude")
      .and.returnValue(true)
      .and.callThrough();
    const longSpy = spyOn<any>(service, "getLongitude")
      .and.returnValue(true)
      .and.callThrough();
    service.getLatitude();
    service.getLongitude();
    service.getCoordinates();
    expect(latSpy).toHaveBeenCalled();
    expect(longSpy).toHaveBeenCalled();
    expect(service.latitude).toEqual(45.494828);
    expect(service.longitude).toEqual(-73.577981);
  });

  it("should locationOffAlert", () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    const locationSpy = spyOn<any>(
      service["alertController"],
      "create"
    ).and.callThrough();
    service.locationOffAlert();
    expect(locationSpy).toHaveBeenCalled();
  });

  it("should unsubscribe to position", () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    const position = service.subscribeToPosition();
    expect(service["geolocation"]).toBeDefined();
    service.unsuscribeToPosition();
    expect(position).toBeFalsy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
