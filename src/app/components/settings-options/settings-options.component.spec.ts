import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { IonicRouteStrategy } from '@ionic/angular';
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import { UserServices } from '../../../services/user.services';
import { PoiServices } from '../../../services/poi.services';
import { GeolocationServices } from '../../../services/geolocation.services';
import { DirectionService } from '../../../services/direction.service';
import { IndoorDirectionsService } from '../../../services/indoorDirections.service';
import { SettingsOptionsComponent } from './settings-options.component';
import { TranslationService } from '../../../services/translation.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

//function that loads the external JSON files to the app using http-loader.
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

describe('SettingsOptionsComponent', () => {
  let component: SettingsOptionsComponent;
  let fixture: ComponentFixture<SettingsOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsOptionsComponent],
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        DirectionService,
        IndoorDirectionsService,
        TranslationService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
