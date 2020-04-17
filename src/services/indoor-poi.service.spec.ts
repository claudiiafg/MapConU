import { TestBed } from '@angular/core/testing';

import { IndoorPoiService } from './indoor-poi.service';

describe('IndoorPoiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndoorPoiService = TestBed.get(IndoorPoiService);
    expect(service).toBeTruthy();
  });

  it('should set condition suitable', () => {
    const service: IndoorPoiService = TestBed.get(IndoorPoiService);
    const bathroom = 'bathroom';
    service.setConditions(bathroom);
    expect(service['pois']).toEqual(['wc-female', 'wc-male']);
    const escalator = 'escalator';
    service.setConditions(escalator);
    expect(service['pois']).toEqual(['escalator-up', 'escalator-down', 'escalator']);
    const stairs = 'stairs';
    service.setConditions(stairs);
    expect(service['pois']).toEqual(['stairs-ne', 'stairs-nw', 'stairs-sw', 'stairs-se']);
    const elevators = 'elevators';
    service.setConditions(elevators);
    expect(service['pois']).toEqual(['elevator']);
    const fireExit = 'fireExit';
    service.setConditions(fireExit);
    expect(service['pois']).toEqual(['exit1', 'exit2', 'exit3', 'exit4']);
    const entrance = 'entrance';
    service.setConditions(entrance);
    expect(service['pois']).toEqual(['entrance']);
  });

  it('should set condition not suitable', () => {
    const service: IndoorPoiService = TestBed.get(IndoorPoiService);
    const poi = 'testing';
    console.log = jasmine.createSpy("'testing', 'not an accepted poi'");
    service.setConditions(poi);
    expect(console.log).toHaveBeenCalledWith('testing', 'not an accepted poi');
  });

  it('should show location', () => {
    const service: IndoorPoiService = TestBed.get(IndoorPoiService);
    const poi = 'fireExit';
    const mySpy1 = spyOn(service, 'showLocation').and.callThrough();
    const tempService = service['dataSharing'];
    const mySpy2 = spyOn(tempService, 'showIndoorPoi').and.callThrough();
    service['pois'] = ['exit1', 'exit2', 'exit3', 'exit4'];
    service.showLocation(poi);
    // check if showLocation has been called
    expect(mySpy1).toHaveBeenCalled();
    // check if the inner function for dataSharing is called
    expect(mySpy2).toHaveBeenCalled();
  });

  it('should hide location', () => {
    const service: IndoorPoiService = TestBed.get(IndoorPoiService);
    const poi = 'stairs';
    const mySpy1 = spyOn(service, 'hideLocation').and.callThrough();
    const tempService = service['dataSharing'];
    const mySpy2 = spyOn(tempService, 'hideIndoorPoi').and.callThrough();
    service['pois'] = ['stairs-ne', 'stairs-nw', 'stairs-sw', 'stairs-se'];
    service.hideLocation(poi);
    // check if showLocation has been called
    expect(mySpy1).toHaveBeenCalled();
    // check if the inner function for dataSharing is called
    expect(mySpy2).toHaveBeenCalled();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
