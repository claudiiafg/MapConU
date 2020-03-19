import { TestBed } from '@angular/core/testing';
import {Geolocation} from '@ionic-native/geolocation/ngx';

import { GeolocationServices } from './geolocation.services';


describe('GeolocationServices', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      providers: [
        Geolocation,
        GeolocationServices,
      ]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    expect(service).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
