import { TestBed } from '@angular/core/testing';
import {DirectionsManagerService} from './directionsManager.service';
import { TranslationService } from './translation.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

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
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
