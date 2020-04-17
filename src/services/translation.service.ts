import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataSharingService } from './data-sharing.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage;

  constructor(
    private translate: TranslateService,
    private dataSharing: DataSharingService
  ) {}

  /**
   * Automatically sets the app to french is the users phone is french and english otherwise
   *
   */
  getDefaultLanguage() {
    let language = this.translate.getBrowserLang();
    console.log('default language is: ', language);
    if (language == 'fr') {
      this.translate.setDefaultLang(language);
    } else {
      this.translate.setDefaultLang('en');
    }
    /**
     * Notify subscribers of default language
     */
    this.currentLanguage = language;
    return language;
  }

  /**
   * Function to manually change to app language using the settings function
   *
   * @param newLang the new language set for the app
   */
  setLanguage(newLang) {
    this.translate.use(newLang);
    this.currentLanguage = newLang;
    console.log('language is set to: ', newLang);
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Encapsulate subscription to language changes (method for all components that have text)
   *
   * @param currentLanguage The currently selected language for the app
   */
  subscribeToAppLanguage(currentLanguage: string) {
    this.dataSharing.currentMessage.subscribe(updatedLanguage => {
      console.log('msg recieved');
      if (currentLanguage != updatedLanguage && currentLanguage != null) {
      }
      currentLanguage = updatedLanguage;
    });
  }

  /**
   * Method to translate text
   *
   * @param toTranslate the key of the json object containing the translation
   * @returns Translation from the correct json file
   */
  getTranslation(toTranslate: string) {
    return this.translate.instant(toTranslate);
  }
}
