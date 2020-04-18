import { TestBed } from "@angular/core/testing";

import { HttpClientService } from "./httpclient.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("HttpclientService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        IonicModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: LanguageLoader,
            deps: [HttpClient]
          }
        })
      ]
    }).compileComponents();
  });
  it("should be created", () => {
    const service: HttpClientService = TestBed.get(HttpClientService);
    expect(service).toBeTruthy();
  });
  it("should test getUserCalendars", () => {
    const service: HttpClientService = TestBed.get(HttpClientService);
    // callThrough will use the real nested funtions from the service
    const mySpy = spyOn(service["http"], "get").and.callThrough();
    service.getUserCalendars(1);
    // we can't really call this without being logged in which does not work with unit test
    // we can only test if the call was made
    expect(mySpy).toHaveBeenCalled();
  });
  it("should test getEvents", () => {
    const service: HttpClientService = TestBed.get(HttpClientService);
    // callThrough will use the real nested funtions from the service
    const mySpy = spyOn(service["http"], "get").and.callThrough();
    service.getEvents(1, 1);
    // we can't really call this without being logged in which does not work with unit test
    // we can only test if the call was made
    expect(mySpy).toHaveBeenCalled();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
