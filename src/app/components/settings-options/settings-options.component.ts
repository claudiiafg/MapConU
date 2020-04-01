import { Component, OnInit } from '@angular/core';
import { TranslationService} from "../../../services/translation.service";
import { DataSharingService} from "../../../services/data-sharing.service";
import { GoogleOauthService } from "../../../services/google-oauth.service";

@Component({
  selector: 'app-settings-options',
  templateUrl: './settings-options.component.html',
  styleUrls: ['./settings-options.component.scss']
})
export class SettingsOptionsComponent implements OnInit {
  public appLanguage: string;
  private googleSession = null;

  constructor(
      private translate: TranslationService,
      private dataSharing: DataSharingService,
      private googleOAuth: GoogleOauthService
  ) {}

  async ngOnInit() {
      try {
        this.googleSession = await this.googleOAuth.getStoredSession();
      } catch(err) {
        this.googleSession = null;
      }
      
      if (this.translate.getCurrentLanguage() == "fr") {
        this.appLanguage = 'french';
      }
      else {
        this.appLanguage = 'english';
      }
  }

  //changes app language
  languageChange() {
    if (this.appLanguage == 'french') {
      this.translate.setLanguage('fr');
      this.dataSharing.updateAppLanguage('fr');
    } else {
      this.translate.setLanguage('en');
      this.dataSharing.updateAppLanguage('en');
    }
  }

  //login
  async login() {
    await this.googleOAuth.loginUser();
    this.googleSession = await this.googleOAuth.getStoredSession();
  }

  //logout
  async logout() {
    await this.googleOAuth.logoutUser();
    this.googleSession = null;
  }

}
