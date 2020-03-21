import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { webClientId } from 'src/environments/env';

@Injectable({
  providedIn: 'root'
})

// Implementation of goole oauth ionic native plugin
export class GoogleOauthService {

  constructor(private nativeStorage: NativeStorage) {}

  async loginUser() {
    try {
      var login: any = await GooglePlus.login({
        'webClientId': webClientId,
      });
      this.nativeStorage.setItem('google_session', login);
    } catch(err) {
      console.error(err);
    }
  }

  async logoutUser() {
    try {
      var logout: any = await GooglePlus.logout();
      this.nativeStorage.remove('google_session');
    } catch(err) {
      console.error(err);
    }

  }

  async getStoredSession() {
    return await this.nativeStorage.getItem('google_session');
  }
}
