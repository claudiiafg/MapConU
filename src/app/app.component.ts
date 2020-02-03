import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private concordiaRed: string = '#932439';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setStatusBarParameters(true, false, this.concordiaRed);
      this.splashScreen.hide();
    });
  }

  setStatusBarParameters( show: boolean, overWebView: boolean, color: string){
    if (show) {
        this.statusBar.show();
    } else {
        this.statusBar.hide();
    }
    this.statusBar.overlaysWebView(overWebView);
    this.statusBar.backgroundColorByHexString(color);
  }
}
