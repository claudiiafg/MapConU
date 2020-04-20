import { TestBed } from "@angular/core/testing";
import { BehaviorSubject, Observable } from "rxjs";
import { SqliteService } from "./sqlite.service";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { SQLitePorter } from "@ionic-native/sqlite-porter/ngx";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslateStore
} from "@ngx-translate/core";

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

describe("SqliteService", () => {
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
      ],
      providers: [
        SQLite,
        SQLitePorter,
        TranslateLoader,
        TranslateModule,
        TranslateService,
        TranslateStore
      ]
    }).compileComponents();
  });
  it("should be created", () => {
    const service: SqliteService = TestBed.get(SqliteService);
    expect(service).toBeTruthy();
  });
  it("should test getData", () => {
    const service: SqliteService = TestBed.get(SqliteService);
    // callThrough will use the real nested funtions from the service
    const mySpy = spyOn(service["httpClient"], "get").and.callThrough();
    service.getData();
    expect(mySpy).toHaveBeenCalled();
  });
  // it("should test getBuildingsInfo", () => {
  //   let service: SqliteService = TestBed.get(SqliteService);
  //   let storage: SQLiteObject;
  //   expect(service["getBuildingsInfo"]()).toEqual(storage);
  // });
  it("should test dbState", () => {
    const service: SqliteService = TestBed.get(SqliteService);
    // callThrough will use the real nested funtions from the service
    const mySpy = spyOn(service["isDbReady"], "asObservable").and.callThrough();
    service.dbState();
    expect(mySpy).toHaveBeenCalled();
  });
  it("should test fetchBuildings", () => {
    const service: SqliteService = TestBed.get(SqliteService);
    const buildingList = new BehaviorSubject([]).asObservable();
    expect(service.fetchBuildings()).toEqual(buildingList);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
