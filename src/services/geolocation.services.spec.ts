import { TestBed } from '@angular/core/testing';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { GeolocationServices } from './geolocation.services';

describe('GeolocationServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Geolocation, GeolocationServices]
    }).compileComponents();
  });

  it('should be created', () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    expect(service).toBeTruthy();
  });

  it('should get current position', () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    const mySpy = spyOn<any>(service, 'getCurrentPosition').and.callFake( ()  => {
      service.latitude = 45.5;
      service.longitude = -74.5;
      return service.latitude, service.longitude;
    });
    service.getCurrentPosition();
    expect(mySpy).toHaveBeenCalled();
    expect(service.latitude).toEqual(45.5);
    expect(service.longitude).toEqual(-74.5);
  });

  it('should get coordinates', () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    const mySpy = spyOn<any>(service, 'getCoordinates').and.callFake( ()  => {
      service.latitude = 45.494828;
      service.longitude = -73.577981;
      return service.latitude, service.longitude;
    });
    service.getCoordinates();
    expect(mySpy).toHaveBeenCalled();
    expect(service.latitude).toEqual(45.494828);
    expect(service.longitude).toEqual(-73.577981);
  });

  it('should get lat and long', () => {
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    const latSpy = spyOn<any>(service, 'getLatitude').and.callFake( ()  => {
      service.latitude = 45.494828;
      return service.latitude;
    });
    const longSpy = spyOn<any>(service, 'getLongitude').and.callFake( ()  => {
      service.longitude = -73.577981;
      return service.longitude;
    });
    service.getLatitude();
    service.getLongitude();
    expect(latSpy).toHaveBeenCalled();
    expect(longSpy).toHaveBeenCalled();
    expect(service.latitude).toEqual(45.494828);
    expect(service.longitude).toEqual(-73.577981);
  });

  it('should unsubscribe to position', () =>{
    const service: GeolocationServices = TestBed.get(GeolocationServices);
    const position = service.subscribeToPosition();
    expect(service['geolocation']).toBeDefined();
    service.unsuscribeToPosition();
    expect(position).toBeFalsy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
