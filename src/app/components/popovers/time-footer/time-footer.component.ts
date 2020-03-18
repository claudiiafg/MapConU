import { Component, OnInit } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';
import { DirectionService } from 'src/services/direction.service';
import { ModalDirectionsComponent } from '../../outdoor/modal-directions/modal-directions.component';
import { DirectionsManagerService } from 'src/services/directionsManager.service';

@Component({
  selector: 'app-time-footer',
  templateUrl: './time-footer.component.html',
  styleUrls: ['./time-footer.component.scss']
})
export class TimeFooterComponent implements OnInit {
  public isDirectionSet = false;
  public timeLeft: number;
  public distance: number;
  public fare: string;
  private isIndoorDirectionsSet: boolean = false;
  private currentStep = null;
  private isInRoute: boolean = false;

  constructor(
    public modalController: ModalController,
    private directionService: DirectionService,
    private directionsManagerService : DirectionsManagerService,
    private events: Events,

  ) {
    //outdoor directions subscription
    this.directionService.isDirectionSet.subscribe(isDirectionSet => {
      this.isDirectionSet = isDirectionSet;
    });
    this.directionService.directionInfo.subscribe(directionInfo => {
      this.timeLeft = directionInfo.time;
      this.distance = directionInfo.distance;
      this.fare = directionInfo.fare;
      if (directionInfo.presentModal) {
        this.presentModal();
      }
    });

    //indoor directions subscription
    this.directionsManagerService.isInRoute.subscribe(res => {
      if(res === true){
        this.isIndoorDirectionsSet = true;
      } else {
        this.isIndoorDirectionsSet = false;
      }
    });
  }

  //initiate indoor direction
  private initRoute(){
    this.events.publish('isSelectMode', false, Date.now());
    this.isInRoute = true;
    this.getNextStep();
  }

  //get next step to compute in indoor directions
  private getNextStep(){
    this.currentStep = this.directionsManagerService.getNextStep();
  }

  //user has arrived at destination and pressed end
  private endRoute() {
    this.events.publish('path-completed', true, Date.now());
  }

  ngOnInit() {}

  private async presentModal() {
    const modal = await this.modalController.create({
      component: ModalDirectionsComponent,
      componentProps: {
        steps: this.directionService.getDirectionsSteps()
      }
    });
    return await modal.present();
  }
}
