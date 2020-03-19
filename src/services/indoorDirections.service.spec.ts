import { TestBed } from '@angular/core/testing';

import { IndoorDirectionsService } from './indoorDirections.service';

describe('IndoorDirectionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndoorDirectionsService = TestBed.get(IndoorDirectionsService);
    expect(service).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
