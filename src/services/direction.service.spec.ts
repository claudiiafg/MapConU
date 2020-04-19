import { TestBed } from "@angular/core/testing";

import { DirectionService } from "./direction.service";

describe("DirectionService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: DirectionService = TestBed.get(DirectionService);
    service.setDirectionsSteps(1);
    service.getDirectionsSteps();
    service.setStepsIcons(1);
    service.addInfoWindow("test", "test");
    service.closeInfoWindows();
    service.closeMainWindow();
    service.closeAlternateWindow();
    expect(service).toBeTruthy();
  });

  it("should test set and get direction steps", () => {
    const service: DirectionService = TestBed.get(DirectionService);
    let stepsWithIcons = service.setStepsIcons(2);
    service.setDirectionsSteps(stepsWithIcons);
    service.getDirectionsSteps();
    expect(service["directionSteps"]).toBe(2);
  });

  it("should addInfoWindow", () => {
    const service: DirectionService = TestBed.get(DirectionService);
    service.addInfoWindow("testing window", "Main");
    expect(service["mainInfoWindow"]).toBe("testing window");
    expect(service["alternateInfoWindow"]).toBeFalsy();
    service.addInfoWindow("testing alternative window", "Alternative");
    expect(service["alternateInfoWindow"]).toBeTruthy();
    expect(service["alternateInfoWindow"]).toBe("testing alternative window");
  });

  it("test setStepsIcons", () => {
    const service: DirectionService = TestBed.get(DirectionService);
    let stepsWithIcons = [
      {
        travel_mode: "WALKING",
        maneuver: "left",
        travel_icon: "",
        maneuver_icon: ""
      },
      {
        travel_mode: "TRANSIT",
        maneuver: "right",
        travel_icon: "",
        maneuver_icon: ""
      },
      {
        travel_mode: "TESTING1",
        maneuver: "merge",
        travel_icon: "",
        maneuver_icon: ""
      },
      {
        travel_mode: "TESTING2",
        maneuver: "left",
        travel_icon: "",
        maneuver_icon: ""
      }
    ];
    service.setStepsIcons(stepsWithIcons);

    expect(stepsWithIcons[0].travel_icon).toBe("walk");
    expect(stepsWithIcons[1].travel_icon).toBe("train");
    expect(stepsWithIcons[2].travel_icon).toBe("car");
    expect(stepsWithIcons[3].travel_icon).toBe("car");
    expect(stepsWithIcons[0].maneuver_icon).toBe("arrow-round-back");
    expect(stepsWithIcons[1].maneuver_icon).toBe("arrow-round-forward");
    expect(stepsWithIcons[2].maneuver_icon).toBe("git-merge");
    expect(stepsWithIcons[3].maneuver_icon).toBe("arrow-round-back");

    // service["alternateDirectionSet"] = true;
    // let originCoordinate = {
    //   lat: 45,
    //   lng: -70
    // };
    // let destCoordinate = {
    //   lat: 45,
    //   lng: -71
    // };
    // let tempDirection = {
    //   origin: originCoordinate,
    //   destination: destCoordinate
    // };
    // service.outputDirectionOnMap(tempDirection, 50);
  });

  // it("should outputDirectionOnMap", () => {
  //   const service: DirectionService = TestBed.get(DirectionService);
  //   // service["alternateDirectionSet"] = true;
  //   // let tempCoordinate = {
  //   //   lat: 123,
  //   //   lng: 123
  //   // };
  //   // let tempDirection = {
  //   //   origin: tempCoordinate,
  //   //   destination: tempCoordinate
  //   // };
  //   // service.outputDirectionOnMap(tempDirection, 50);
  //   // expect(
  //   //   spyOn<any>(service["alternateDirection"], "set").and.callThrough()
  //   // ).toHaveBeenCalled();
  //   // expect(
  //   //   spyOn<any>(service["isDirectionSet"], "next").and.callThrough()
  //   // ).toHaveBeenCalled();
  //   // expect(
  //   //   spyOn<any>(
  //   //     service["dataSharingService"],
  //   //     "updateMapSize"
  //   //   ).and.callThrough()
  //   // ).toHaveBeenCalled();
  //   // expect(
  //   //   spyOn<any>(service["destination"], "next").and.callThrough()
  //   // ).toHaveBeenCalled();
  //   // expect(service["alternateDirectionSet"]).toBeFalsy();
  //   // service["alternateDirectionSet"] = true;
  //   // let originCoordinate = {
  //   //   lat: 45,
  //   //   lng: -70
  //   // };
  //   // let destCoordinate = {
  //   //   lat: 45,
  //   //   lng: -71
  //   // };
  //   // let tempDirection = {
  //   //   origin: originCoordinate,
  //   //   destination: destCoordinate
  //   // };
  //   // service.outputDirectionOnMap(tempDirection, 50);
  // });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
