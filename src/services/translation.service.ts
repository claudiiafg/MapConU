import { Injectable } from '@angular/core';
import { TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(
      private translate: TranslateService
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
    return language;
  }

  //function to manually change to app language using the settings function
  setLanguage(newLang) {
    this.translate.use(newLang);
    console.log('language is set to: ', newLang);
  }
}
