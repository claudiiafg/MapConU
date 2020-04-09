import { TestBed } from "@angular/core/testing";

import { SqliteService } from "./sqlite.service";
import { SQLite } from "@ionic-native/sqlite/ngx";
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
});
