import { Component, OnInit } from '@angular/core';
import { Location} from "@angular/common";

@Component({
  selector: 'app-settings-toolbar',
  templateUrl: './settings-toolbar.component.html',
  styleUrls: ['./settings-toolbar.component.scss']
})
export class SettingsToolbarComponent implements OnInit {
  constructor(
      private location: Location
  ) {}

  ngOnInit() {}

  /*
  Takes the user back to whichever page they came from, indoor or outdoor
   */
  public goBack(){
    this.location.back();
  }
}
