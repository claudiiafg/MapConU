import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataSharingService } from '../services/data-sharing.service';
import { UserServices } from 'src/services/user.services';
import { TranslationService } from '../services/translation.service';
import { Router } from '@angular/router';
import { GoogleMapComponent } from './components/outdoor/google-map/google-map.component';
import { OutdoorNavigationSideButtonsComponent} from "./components/outdoor/outdoor-navigation-side-buttons/outdoor-navigation-side-buttons.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private concordiaRed: string = '#800000';
  message: any;
  subscribe: any;
  isOpen: boolean;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private data: DataSharingService,
    private userServices: UserServices,
    private alertController: AlertController,
    private router: Router,
    private translationService: TranslationService
  ) {
    this.initializeApp();
    this.isOpen = false;
    this.subscribe = this.platform.backButton.subscribeWithPriority(
      666666,
      () => {
        //&& !this.googleMapComp.isOpen
        if (this.router.url == '/outdoor' && !GoogleMapComponent.isOpen && !this.isOpen && !OutdoorNavigationSideButtonsComponent.isOpen) {
          this.confirmMessage();
        }
      }
    );
  }
  async confirmMessage() {
    this.isOpen = true;
    let alert = await this.alertController.create({
      header: this.translationService.getTranslation('Do you want to quit?'),
      cssClass: 'alert-css',
      buttons: [
        {
          text: this.translationService.getTranslation('cancel'),
          cssClass: 'alert-button-map',
          role: 'cancel',
          handler: () => {
            // close popup
            this.isOpen = false;
          },
        },
        {
          text: this.translationService.getTranslation('quit'),
          cssClass: 'alert-button-map',
          role: 'quit',
          handler: () => {
            this.isOpen = false;
            navigator['app'].exitApp();
          },
        },
      ],
    });
    this.isOpen = true;
    await alert.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setStatusBarParameters(true, false, this.concordiaRed);
      this.splashScreen.hide();
      this.data.currentMessage.subscribe((message) => (this.message = message));

      this.userServices.AFauth.auth.onAuthStateChanged((user) => {
        if (user) {
          // Start by initiating the services once the user has logged in
          this.userServices.initSubscription();
        }
      });
    });
    /*Sets the default app language to french or english based on the users language setting*/
    this.translationService.getDefaultLanguage();
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
