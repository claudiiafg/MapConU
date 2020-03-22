import { TestBed } from '@angular/core/testing';

import { GoogleOauthService } from './google-oauth.service';
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { RouteReuseStrategy } from "@angular/router";
import { IonicRouteStrategy } from "@ionic/angular";

describe('GoogleOauthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleOauthService,
        NativeStorage,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}]
    }).compileComponents();
  });
  it('should be created', () => {
    const service: GoogleOauthService = TestBed.get(GoogleOauthService);
    service.getStoredSession();
    service.loginUser();
    service.logoutUser();
    expect(service).toBeTruthy();
  });
});
