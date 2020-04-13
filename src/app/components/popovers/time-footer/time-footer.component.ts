import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events, ModalController } from '@ionic/angular';
import { DirectionService } from 'src/services/direction.service';
import {
  DirectionsManagerService,
  MixedDirectionsType,
} from 'src/services/directionsManager.service';
import { StringHelperService } from 'src/services/stringHelper.service';
import { TranslationService } from 'src/services/translation.service';
import { ModalDirectionsComponent } from '../../outdoor/modal-directions/modal-directions.component';
import { DataSharingService } from 'src/services/data-sharing.service';

@Component({
  selector: 'app-time-footer',
  templateUrl: './time-footer.component.html',
  styleUrls: ['./time-footer.component.scss'],
})
export class TimeFooterComponent implements OnInit {
  public isDirectionSet = false;
  public timeLeft: number;
  public distance: number;
  public fare: string;
  public isIndoorDirectionsSet: boolean = false;
  public currentStep = null;
  public isIndoorInRoute: boolean = false;
  private startFromCurrent: boolean = false;

  constructor(
    public modalController: ModalController,
    public router: Router,
    private directionService: DirectionService,
    private directionsManager: DirectionsManagerService,
    private events: Events,
    private stringHelper: StringHelperService,
    private translate: TranslationService,
    private dataSharing: DataSharingService

  ) {
    //outdoor directions subscription
    this.directionService.isDirectionSet.subscribe((isDirectionSet) => {
      this.isDirectionSet = isDirectionSet;
    });
    this.directionService.directionInfo.subscribe((directionInfo) => {
      this.timeLeft = directionInfo.time;
      this.distance = directionInfo.distance;
      this.fare = directionInfo.fare;
      if (directionInfo.presentModal) {
        this.presentModal();
      }
    });

    //indoor directions subscription
    this.directionsManager.isIndoorInRoute.subscribe((res) => {
      if (res === true) {
        this.isIndoorDirectionsSet = true;
      } else {
        this.isIndoorDirectionsSet = false;
      }
    });

    //subscribe to user clicking on next step from outside
    this.events.subscribe('get-next-step', () => {
      this.getStepAfterOutdoor();
    });

    //when initiating the indoor component during a route
    if (this.directionsManager.stepsBeenInit()) {
      this.isIndoorInRoute = true;
    }

    if (this.directionsManager.isIndoorInRoute.getValue() === true) {
      if (
        !this.router.url.includes('outdoor') &&
        this.directionsManager.getMixedType() ===
          MixedDirectionsType.classToClass
      ) {
        this.isIndoorDirectionsSet = true;
        this.currentStep = this.directionsManager.getCurrentStep();

        if (this.currentStep.isLast) {
          this.isIndoorInRoute = true;
          this.startFromCurrent = false;
        } else {
          this.isIndoorInRoute = false;
          this.startFromCurrent = true;
        }

        this.setCurrentStep();
      }
    }
  }

  ngOnInit() {
    this.subscribeToBuildingToFloor();
  }

  //initiate indoor direction
  public initRoute() {
    this.events.publish('isSelectMode', false, Date.now());
    this.isIndoorInRoute = true;
    if (this.startFromCurrent) {
      this.currentStep = this.directionsManager.startFromCurrentStep();
      this.setCurrentStep();
    } else {
      this.getNextStep();
    }
  }

  public subscribeToBuildingToFloor() {
    this.events.subscribe('building-to-floor', () => {
      this.initRoute();
    });
  }

  public async presentModal() {
    const modal = await this.modalController.create({
      component: ModalDirectionsComponent,
      componentProps: {
        steps: this.directionService.getDirectionsSteps(),
      },
    });
    return await modal.present();
  }

  //get next step to compute in indoor directions
  public getNextStep() {
    this.currentStep = this.directionsManager.getNextStep();
    if (this.currentStep.floor) {
      if (this.router.url.includes('outdoor')) {
        this.directionsManager.continueWithIndoorDirections();
      }
      this.setCurrentStep();
    } else {
      this.directionsManager.continueWithOutdoorDirection();
    }
  }

  //user has arrived at destination and pressed end
  public endRoute() {
    this.isIndoorInRoute = false;
    this.events.publish('path-completed', true, Date.now());
    this.dataSharing.showIndoorToa(false);
  }

  private getStepAfterOutdoor() {
    this.currentStep = this.directionsManager.getStepAfterOutdoor();
    this.setCurrentStep();
  }

  private setCurrentStep() {
    this.currentStep._prettySource = this.stringHelper.prettifyTitles(
      this.currentStep.source
    );
    this.currentStep._prettyDest = this.stringHelper.prettifyTitles(
      this.currentStep.dest
    );
  }
}
