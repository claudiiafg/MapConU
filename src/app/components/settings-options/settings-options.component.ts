import { Component, OnInit } from '@angular/core';
import { TranslationService} from "../../../services/translation.service";
import { DataSharingService} from "../../../services/data-sharing.service";

@Component({
  selector: 'app-settings-options',
  templateUrl: './settings-options.component.html',
  styleUrls: ['./settings-options.component.scss'],
})
export class SettingsOptionsComponent implements OnInit {
  public appLanguage: string;

  constructor(
      private translate: TranslationService,
      private dataSharing: DataSharingService
  ) { }

  ngOnInit() {

      if (this.translate.getCurrentLanguage() == "fr") {
        this.appLanguage = 'french';
      }
      else {
        this.appLanguage = 'english';
      }

  }

  //changes app language
  languageChange(){
    if (this.appLanguage == "french"){
      this.translate.setLanguage('fr');
      this.dataSharing.updateMessage('fr');
    }
    else{
      this.translate.setLanguage('en');
      this.dataSharing.updateMessage('en');
    }
  }

}
