import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import { IndoorNavigationToolbarComponent } from './indoor-navigation-toolbar.component';
import { UserServices } from '../../../../services/user.services';
import { PoiServices } from '../../../../services/poi.services';
import { GeolocationServices } from '../../../../services/geolocation.services';
import {TranslationService} from "../../../../services/translation.service";
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule,TranslateLoader} from '@ngx-translate/core';

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

describe('IndoorNavigationToolbarComponent ', () => {
  let component: IndoorNavigationToolbarComponent;
  let fixture: ComponentFixture<IndoorNavigationToolbarComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]),
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (LanguageLoader),
          deps: [HttpClient]
        }
      })
    ],
      declarations: [IndoorNavigationToolbarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        TranslationService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(IndoorNavigationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
