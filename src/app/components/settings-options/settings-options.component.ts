import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-options',
  templateUrl: './settings-options.component.html',
  styleUrls: ['./settings-options.component.scss'],
})
export class SettingsOptionsComponent implements OnInit {
  public appLanguage: string;

  constructor() { }

  ngOnInit() {
    this.appLanguage = "english";
  }

}
