import { TestBed } from "@angular/core/testing";
import { Point } from "src/services/indoorDirections.service";

import { IndoorDirectionsService } from "./indoorDirections.service";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";

let testLine = {
  id: "elevator",
  p1: {
    x: 123,
    y: 123
  },
  p2: {
    x: 123,
    y: 123
  },
  length: 123,
  connectedLines: [],

  _wasVisited: true,
  _isIntersection: true,
  _isLeaf: true
};

let tempDocElementLines = {
  id: "1",
  x1: {
    baseVal: {
      value: "1"
    }
  },
  x2: {
    baseVal: {
      value: "1"
    }
  },
  y1: {
    baseVal: {
      value: "1"
    }
  },
  y2: {
    baseVal: {
      value: "1"
    }
  }
};

let tempDocInterestPoints = {
  id: "1",
  cx: {
    baseVal: {
      value: "1"
    }
  },
  cy: {
    baseVal: {
      value: "1"
    }
  }
};

describe("IndoorDirectionsService", () => {
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
    TestBed.configureTestingModule({}).compileComponents();
  });
  it("should be created", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    expect(service).toBeTruthy();
  });
  it("should setMap", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    const mySpy = spyOn<any>(service, "setMap")
      .and.returnValue(true)
      .and.callThrough();
    const myResetSpy = spyOn<any>(service, "resetAll")
      .and.returnValue(true)
      .and.callThrough();
    service.setMap(tempDocElementLines, tempDocInterestPoints);
    expect(mySpy).toHaveBeenCalled();
    expect(myResetSpy).toHaveBeenCalled();
    expect(service["interestPoints"]).toEqual([]);
    expect(service["pathLines"]).toEqual([]);
  });

  it("should test reset", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    service["pathLines"] = [];
    service["reset"]();
    expect(service["foundPath"]).toBeFalsy();
    expect(service["path"]).toEqual([]);
    expect(service["sourceLine"]).toBeNull();
    expect(service["destLine"]).toBeNull([]);
    expect(service["sourceID"]).toEqual("");
    expect(service["destID"]).toEqual("");
  });

  it("should test resetAll", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    service["resetAll"]();
    expect(service["pathLines"]).toBeNull();
    expect(service["interestPoints"]).toBeNull([]);
  });
  it("should test computePathHelper", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    const mySpy = spyOn<any>(service, "computePathHelper").and.callThrough();
    const mySourceSpy = spyOn<any>(service, "setSource").and.callThrough();
    service["computePathHelper"]("h-820", "h-821");
    expect(mySpy).toHaveBeenCalled();
    expect(mySourceSpy).toHaveBeenCalled();
  });
  it("should test resetNav and setSource and setDest", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    service["pathLines"] = [];
    service["resetNav"]();
    expect(service["foundPath"]).toBeFalsy();
    expect(service["path"]).toEqual([]);
  });
  it("should test getLines", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    service["pathLines"] = [null];
    expect(service["getLines"]()).toEqual([null]);
  });
  it("should test getPoints", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    service["interestPoints"] = [null];
    expect(service["getPoints"]()).toEqual([null]);
  });
  it("should test getPath", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    service["path"] = [null];
    expect(service["getPath"]()).toEqual([null]);
  });
  it("should test getPathLength", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    service["foundPath"] = true;
    service["pathLength"] = 12;
    expect(service["getPathLength"]()).toEqual(12);
  });

  it("should test setSource and setDest", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    service["sourceLine"] = testLine;
    expect(function() {
      service["setSource"]("elevator");
    }).toThrowError("elevator: Point does not exist");
    expect(function() {
      service["setDest"]("elevator");
    }).toThrowError("elevator: Point does not exist");
  });

  it("should test getPointByName", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    const mySpy = spyOn<any>(
      service["interestPoints"],
      "filter"
    ).and.callThrough();
    service.getPointByName("escalator-down");
    expect(mySpy).toHaveBeenCalled();
    // undefined since it is a fake point not valid when filtering
    expect(service.getPointByName("escalator-down")).toBeUndefined();
  });

  it("should test sharePoint", () => {
    const service: IndoorDirectionsService = TestBed.get(
      IndoorDirectionsService
    );
    // should return true since we are checking two identical lines
    expect(service["sharePoint"](testLine, testLine)).toBeTruthy();
  });
  // it("should test calcLength", () => {
  //   const service: IndoorDirectionsService = TestBed.get(
  //     IndoorDirectionsService
  //   );
  //   expect(service["calcLength"](5, 5, 15, 15)).toEqual(5);
  //   expect(service["calcLength"](5, 15, 15, 15)).toEqual(5);
  // });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
