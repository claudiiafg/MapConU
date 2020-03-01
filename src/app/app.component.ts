import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DataSharingService } from "../services/data-sharing.service";
import { UserServices } from "src/services/userServices";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  private concordiaRed: string = "#800000";
  message: any;
  private isOutdoor: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private data: DataSharingService,
    private userServices: UserServices
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setStatusBarParameters(true, false, this.concordiaRed);
      this.splashScreen.hide();
      this.data.currentMessage.subscribe(message => (this.message = message));

      this.userServices.AFauth.auth.onAuthStateChanged(user => {
        if (user) {
          // Start by initiating the services once the user has logged in
          this.userServices.initSubscription();
        }
      });
    });
  }

  setStatusBarParameters(show: boolean, overWebView: boolean, color: string) {
    if (show) {
      this.statusBar.show();
    } else {
      this.statusBar.hide();
    }
    this.statusBar.overlaysWebView(overWebView);
    this.statusBar.backgroundColorByHexString(color);
  }
}
