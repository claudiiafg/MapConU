import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import { OutdoorNavigationSideButtonsComponent } from './outdoor-navigation-side-buttons.component';
import { UserServices } from '../../../../services/user.services';
import { PoiServices } from '../../../../services/poi.services';
import { GeolocationServices } from '../../../../services/geolocation.services';
import { DirectionService } from '../../../../services/direction.service';
import { IndoorDirectionsService } from '../../../../services/indoorDirections.service';
import {TranslationService} from "../../../../services/translation.service";

describe('OutdoorNavigationSideButtonsComponent ', () => {
  let component: OutdoorNavigationSideButtonsComponent;
  let fixture: ComponentFixture<OutdoorNavigationSideButtonsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), IonicModule.forRoot()],
      declarations: [OutdoorNavigationSideButtonsComponent],
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
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorNavigationSideButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test poi toggle', () => {
    fixture.detectChanges();
    fixture.debugElement
        .triggerEventHandler('click', 'pin' );
    expect(component.presentPopover('click', 'poi')).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
