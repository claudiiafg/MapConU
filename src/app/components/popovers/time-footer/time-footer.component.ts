import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(
    public modalController: ModalController,
    private directionService: DirectionService,
    private directionsManagerService : DirectionsManagerService

  ) {
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
    this.directionsManagerService.isInRoute.subscribe(res => {
      if(res){
        this.isIndoorDirectionsSet = true;
      }
    });
  }

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalDirectionsComponent,
      componentProps: {
        steps: this.directionService.getDirectionsSteps()
      }
    });
    return await modal.present();
  }
}
