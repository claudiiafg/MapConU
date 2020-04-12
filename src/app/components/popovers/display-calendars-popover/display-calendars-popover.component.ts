import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-display-calendars-popover',
  templateUrl: './display-calendars-popover.component.html',
  styleUrls: ['./display-calendars-popover.component.scss'],
})

export class DisplayCalendarsPopoverComponent implements OnInit {
  private calendars: any;
  private isChecked: any;

  constructor(private navParams: NavParams, private nativeStorage: NativeStorage) {
    this.calendars = this.navParams.get('calendars');
    this.isChecked = this.navParams.get('isChecked');
  }

  ngOnInit() { }

  public async selectEvent() {
    try {
      await this.nativeStorage.setItem('calendars', this.isChecked);
    } catch(err) {
      console.log(err);
    }
  }
}
