import { TestBed } from "@angular/core/testing";
import { Geolocation } from "@ionic-native/geolocation/ngx";

import { PoiServices } from "./poi.services";

describe("PoiServices", () => {
  let defaultToggles = {
    restaurants: false,
    coffee: false,
    gas: false,
    drugstore: false,
    hotels: false,
    grocery: false
  };
  let trueToggles = {
    restaurants: true,
    coffee: true,
    gas: true,
    drugstore: true,
    hotels: true,
    grocery: true
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Geolocation, PoiServices]
    }).compileComponents();
  });
  it("should be created", () => {
    const service: PoiServices = TestBed.get(PoiServices);
    service.setPOIMarkers("tempType", 45, -75);
    service.getPOIMarkers();
    service.hasType("tempType");
    service.removePOIMarkers("tempType");
    service.setCurrentToggles({
      restaurants: false,
      coffee: false,
      gas: false,
      drugstore: false,
      hotels: false,
      grocery: false
    });
    service.getCurrentToggles();
    service.resetPOIMarkers();
    expect(service).toBeTruthy();
  });
  it("should setPOIMarkers()", () => {
    const service: PoiServices = TestBed.get(PoiServices);
    expect(typeof service.setPOIMarkers("tempType", 45, -75)).toEqual("object");
  });
  it("should getPOIMarkers()", () => {
    const service: PoiServices = TestBed.get(PoiServices);
    service["poiMarkers"] = [];
    expect(typeof service.getPOIMarkers()).toEqual("object");
    expect(service.getPOIMarkers()).toEqual([]);
  });
  it("should hasType('somestring') invalid", () => {
    const service: PoiServices = TestBed.get(PoiServices);
    service["poiMarkers"] = ["temp1", "temp2", "temp3"];
    expect(service.hasType("test")).toBeFalsy();
  });
  it("should hasType('somestring') valid", () => {
    const service: PoiServices = TestBed.get(PoiServices);
    service["poiMarkers"] = ["temp1", "temp2", "temp3"];
    service["poiMarkers"].push({
      type: "temp"
    });
    expect(service.hasType("temp")).toBeTruthy();
  });
  it("should removePOIMarkers('temp1')", () => {
    const service: PoiServices = TestBed.get(PoiServices);
    service["poiMarkers"];
    service["poiMarkers"].push({
      type: "temp1"
    });
    expect(service.removePOIMarkers("temp1")).toEqual([]);
  });
  it("should setCurrentToggles(currentToggles)", () => {
    const service: PoiServices = TestBed.get(PoiServices);
    let currentToggles = trueToggles;
    service.setCurrentToggles(currentToggles);
    expect(service["currentToggles"]).toEqual(currentToggles);
  });
  it("should getCurrentToggles()", () => {
    const service: PoiServices = TestBed.get(PoiServices);
    service["currentToggles"] = defaultToggles;
    expect(service["getCurrentToggles"]()).toEqual(service["currentToggles"]);
  });
  it("should resetPOIMarkers()", () => {
    const service: PoiServices = TestBed.get(PoiServices);
    service["currentToggles"] = trueToggles;
    expect(service["resetPOIMarkers"]()).toEqual(defaultToggles);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
