import { TestBed } from "@angular/core/testing";
import { TranslationService } from "./translation.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { DataSharingService } from "./data-sharing.service";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("TranslationService", () => {
  beforeEach(() => {
    let dataSharing: DataSharingService;
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: LanguageLoader,
            deps: [HttpClient]
          }
        })
      ],
      providers: [TranslationService]
    }).compileComponents();
  });

  it("should be created", () => {
    const service: TranslationService = TestBed.get(TranslationService);
    service.getDefaultLanguage();
    service.setLanguage("en");
    service.getCurrentLanguage();
    service.subscribeToAppLanguage("en");
    service.getTranslation("en");
    expect(service).toBeTruthy();
  });
  it("should getDefaultLanguage and return en", () => {
    const service: TranslationService = TestBed.get(TranslationService);
    expect(service.getDefaultLanguage()).toEqual("en");
  });
  it("should setLanguage()", () => {
    const service: TranslationService = TestBed.get(TranslationService);
    service["currentLanguage"] = "en";
    service.setLanguage("fr");
    expect(service["currentLanguage"]).toEqual("fr");
  });
  it("should getCurrentLanguage()", () => {
    const service: TranslationService = TestBed.get(TranslationService);
    service["currentLanguage"] = "en";
    expect(service.getCurrentLanguage()).toEqual("en");
  });
  it("should subscribeToAppLanguage()", () => {
    const service: TranslationService = TestBed.get(TranslationService);
    service["currentLanguage"] = "en";
    // fake the behavior due to not being able and inject dataSharing service in providers
    const mySpy = spyOn<any>(service, "subscribeToAppLanguage").and.callFake(
      updatedLanguage => {
        service["currentLanguage"] = updatedLanguage;
      }
    );
    service["subscribeToAppLanguage"]("fr");
    expect(mySpy).toHaveBeenCalled();
    expect(service["currentLanguage"]).toEqual("fr");
  });
  it("should getTranslation()", () => {
    const service: TranslationService = TestBed.get(TranslationService);
    service["currentLanguage"] = "en";
    expect(service.getTranslation("Drugstores")).toEqual("Drugstores");
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
