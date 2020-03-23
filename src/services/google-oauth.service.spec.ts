import { TestBed } from '@angular/core/testing';

import { GoogleOauthService } from './google-oauth.service';
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { RouteReuseStrategy } from "@angular/router";
import { IonicRouteStrategy } from "@ionic/angular";
import {GooglePlus} from "@ionic-native/google-plus";

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

  it('should login user', () => {
    const service: GoogleOauthService = TestBed.get(GoogleOauthService);
    const mySpy = spyOn<any>(service, "loginUser").and.callFake(() =>{
      try {
        const login: any =  GooglePlus.login({
          'webClientId': '587682338275-slma4inmi8e0fgft1tv89plac17iud1g.apps.googleusercontent.com',
        });
        this.nativeStorage.setItem('google_session', login);
      } catch(err) {
        console.error(err);
      }
        }
    );
    service.loginUser();
    expect(mySpy).toHaveBeenCalled();
  });

  it('should logout user', () => {
    const service: GoogleOauthService = TestBed.get(GoogleOauthService);
    const mySpy = spyOn<any>(service, 'logoutUser').and.callFake(() => {
      console.log('google session removed');
    });
    service.logoutUser();
    expect(mySpy).toHaveBeenCalled();
  });

  it('should get stored session', () => {
    const service: GoogleOauthService = TestBed.get(GoogleOauthService);
    const mySpy = spyOn<any>(service, 'getStoredSession').and.callFake(() => {
      console.log('google session retrieved');
    });
    service.getStoredSession();
    expect(mySpy).toHaveBeenCalled()
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
