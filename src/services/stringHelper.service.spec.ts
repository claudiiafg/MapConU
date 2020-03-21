import { TestBed } from '@angular/core/testing';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslationService} from "./translation.service";
import {StringHelperService} from "./stringHelper.service";


//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

describe('StringHelperService', () => {
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
        StringHelperService,
        TranslationService
      ]
    }).compileComponents();
  }));
  it('should be created', () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
