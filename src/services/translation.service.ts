import { Injectable } from '@angular/core';
import { TranslateService} from "@ngx-translate/core";
import { DataSharingService} from "./data-sharing.service";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage;

  constructor(
      private translate: TranslateService,
      private dataSharing: DataSharingService
  ) { }

  //automatically sets the app to french is the users phone is french and english otherwise
  getDefaultLanguage(){
    let language = this.translate.getBrowserLang();
    console.log('default language is: ', language);
    if (language == 'fr') {
      this.translate.setDefaultLang(language);
    }
    else{
      this.translate.setDefaultLang('en');
    }
    //notify subscribers of default language
    this.currentLanguage = language;
    return language;
  }

  //function to manually change to app language using the settings function
  setLanguage(newLang) {
    this.translate.use(newLang);
    this.currentLanguage = newLang;
    console.log('language is set to: ', newLang);
  }

  getCurrentLanguage(){
    return this.currentLanguage;
  }

  //encapsulate subscription to language changes (method for all components that have text)
  subscribeToAppLanguage(currentLanguage: string, ){
    this.dataSharing.currentMessage.subscribe(updatedLanguage => {
      console.log('msg recieved');
      if (currentLanguage != updatedLanguage && currentLanguage != null) {
        location.reload();
      }
      currentLanguage = updatedLanguage;
    });
  }
}
