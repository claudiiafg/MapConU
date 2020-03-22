import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';

import { DataSharingService } from './data-sharing.service';
import {BehaviorSubject} from "rxjs";

describe('DataSharingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataSharingService = TestBed.get(DataSharingService);
    service.updateMessage('test');
    service.updateAppLanguage('en');
    service.updateMapSize(100);
    expect(service).toBeTruthy();
  });

  it('should update message', () => {
    const service: DataSharingService = TestBed.get(DataSharingService);
    service.updateMessage('testing');
    expect(service['messageSrc']).toEqual(new BehaviorSubject<any>('testing'));
  });

  it('should update map size', () => {
    const service: DataSharingService = TestBed.get(DataSharingService);
    const platform: Platform =  TestBed.get(Platform);
    service.updateMapSize(10);
    expect(service['mapSize']).toEqual(new BehaviorSubject<any>(platform.height() +10));
  });

  it('should update app language', () => {
    const service: DataSharingService = TestBed.get(DataSharingService);
    service.updateAppLanguage('en');
    expect(service.language).toEqual(new BehaviorSubject<any>('en'));
    service.updateAppLanguage('fr');
    expect(service.language).toEqual(new BehaviorSubject<any>('fr'));
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
