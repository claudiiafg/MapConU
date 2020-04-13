import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})

// Implementation of goole oauth ionic native plugin
export class GoogleOauthService {

  constructor(private nativeStorage: NativeStorage) {}

  async loginUser() {
    try {
      var login: any = await GooglePlus.login({
        'webClientId': '587682338275-slma4inmi8e0fgft1tv89plac17iud1g.apps.googleusercontent.com',
        'scopes': 'email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
      });
      this.nativeStorage.setItem('google_session', login);
    } catch(err) {
      console.error(err);
    }
  }

  async logoutUser() {
    try {
      await GooglePlus.logout();
      await this.nativeStorage.remove('google_session');
      await this.nativeStorage.remove('calendars');
    } catch(err) {
      console.error(err);
    }

  }

  async getStoredSession() {
    return await this.nativeStorage.getItem('google_session');
  }
}
