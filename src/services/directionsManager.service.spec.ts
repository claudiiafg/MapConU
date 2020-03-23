import { TestBed } from '@angular/core/testing';
import {DirectionsManagerService} from './directionsManager.service';
import { TranslationService } from './translation.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {BehaviorSubject} from "rxjs";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

describe('DirectionsManagerService', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (LanguageLoader),
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        TranslationService,
        DirectionsManagerService
      ]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: DirectionsManagerService = TestBed.get(DirectionsManagerService);
    expect(service).toBeTruthy();
  });

  it('should reset steps', () => {
    const service: DirectionsManagerService = TestBed.get(DirectionsManagerService);
    service['steps'] =[2];
    expect(service['steps']).toEqual([2]);
    service.resetSteps();
    expect(service['steps']).toEqual([]);
  });

  it('should set and get selectmode', () => {
    const service: DirectionsManagerService = TestBed.get(DirectionsManagerService);
    service.setSelectMode(true);
    service.getIsSelectMode();
    expect(service['isSelectMode']).toEqual(true);
  });

  // it('should subscribe to events', () => {
  //   const service: DirectionsManagerService = TestBed.get(DirectionsManagerService);
  //   service.isInRoute.next(true);
  //   service['currentStep'] = '';
  //   const mySpy = spyOn<any>(service, "subscribeToEvents").and.callFake(
  //       () => {
  //           const data = {
  //             source: 'here',
  //             destination: 'there'}
  //             return data;
  //       }
  //       );
  //   service['initiatePathSteps']();
  //   service['this.currentStep.source']='here';
  //   service['this.currentStep.dest']='there';
  //   service['subscribeToEvents']();
  //   expect(mySpy).toHaveBeenCalled();
  //   expect(service['data']).toBeDefined();
  // });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
