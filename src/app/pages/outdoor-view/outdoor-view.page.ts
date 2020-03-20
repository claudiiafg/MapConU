import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { OutdoorNavigationToolbarComponent} from "../../components/outdoor/outdoor-navigation-toolbar/outdoor-navigation-toolbar.component";

@Component({
  selector: 'app-outdoor-view',
  templateUrl: './outdoor-view.page.html',
  styleUrls: ['./outdoor-view.page.scss']
})
export class OutdoorViewPage implements OnInit {
  @ViewChild('toolbar', { static: false }) toolbar: OutdoorNavigationToolbarComponent;

  constructor(
      private router: Router
  ) {}

  ngOnInit() {}

  navigate(path: []) {
    this.router.navigate(path);
  }

  ionViewWillEnter(){
    this.toolbar.loc = '2';
  }
}
