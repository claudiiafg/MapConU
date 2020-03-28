import { TestBed } from '@angular/core/testing';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { PoiServices } from './poi.services';

describe('PoiServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Geolocation, PoiServices]
    }).compileComponents();
  });
  it('should be created', () => {
    const service: PoiServices = TestBed.get(PoiServices);
    expect(service).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
