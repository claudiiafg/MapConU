import { Component, OnInit } from '@angular/core';
import { TranslationService} from "../../../services/translation.service";

@Component({
  selector: 'app-settings-options',
  templateUrl: './settings-options.component.html',
  styleUrls: ['./settings-options.component.scss'],
})
export class SettingsOptionsComponent implements OnInit {
  public appLanguage: string;

  constructor(
      private translate: TranslationService
  ) { }

  ngOnInit() {}

  //changes app language
  languageChange(){
    if (this.appLanguage == "french"){
      this.translate.setLanguage('fr');
    }
    else{
      this.translate.setLanguage('en');
    }
  }

}
