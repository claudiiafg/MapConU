import { TestBed } from '@angular/core/testing';

import { DirectionService } from './direction.service';

describe('DirectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DirectionService = TestBed.get(DirectionService);
    service.setDirectionsSteps(1);
    service.getDirectionsSteps();
    service.setStepsIcons(1);
    service.addInfoWindow('test','test');
    service.closeInfoWindows();
    service.closeMainWindow();
    service.closeAlternateWindow();
    expect(service).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
