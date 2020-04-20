import { TestBed } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslationService } from "./translation.service";
import { StringHelperService } from "./stringHelper.service";

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("StringHelperService", () => {
  beforeEach(() => {
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
      providers: [StringHelperService, TranslationService]
    }).compileComponents();
  });
  it("should be created", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    service.prettifyTitles("wc-test");
    expect(service).toBeTruthy();
  });
  it("should prettifyTitles() wc-female", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("wc-female")).toEqual("bathroom-w");
  });
  it("should prettifyTitles() wc-male", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("wc-male")).toEqual("bathroom-m");
  });
  it("should prettifyTitles() wc", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("wc")).toEqual("bathroom");
  });
  it("should prettifyTitles() entrance", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("entrance")).toEqual("entrance");
  });
  it("should prettifyTitles() down-stairs", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("down-stairs")).toEqual("stairs-down");
  });
  it("should prettifyTitles() down-escalator", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("down-escalator")).toEqual("escalator-down");
  });
  it("should prettifyTitles() up-escalator", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("up-escalator")).toEqual("escalators");
  });
  it("should prettifyTitles() up-stairs", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("up-stairs")).toEqual("stairs");
  });
  it("should prettifyTitles() ne-stairs", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("ne-stairs")).toEqual("stairs-ne");
  });
  it("should prettifyTitles() nw-stairs", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("nw-stairs")).toEqual("stairs-nw");
  });
  it("should prettifyTitles() sw-stairs", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("sw-stairs")).toEqual("stairs-sw");
  });
  it("should prettifyTitles() se-stairs", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("se-stairs")).toEqual("stairs-se");
  });
  it("should prettifyTitles() stairs", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("stairs")).toEqual("stairs");
  });
  it("should prettifyTitles() elevators", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("elevators")).toEqual("elevators");
  });
  it("should prettifyTitles() out", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("out")).toEqual("exit");
  });
  it("should prettifyTitles() randomString", () => {
    const service: StringHelperService = TestBed.get(StringHelperService);
    expect(service.prettifyTitles("invalidString")).toEqual("invalidString");
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
