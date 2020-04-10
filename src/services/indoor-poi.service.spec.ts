import { TestBed } from '@angular/core/testing';

import { IndoorPoiService } from './indoor-poi.service';

describe('IndoorPoiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndoorPoiService = TestBed.get(IndoorPoiService);
    expect(service).toBeTruthy();
  });
});
