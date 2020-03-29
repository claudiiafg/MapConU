import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DirectionService } from 'src/services/direction.service';
import { ModalDirectionsComponent } from '../../outdoor/modal-directions/modal-directions.component';

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
  constructor(
    public modalController: ModalController,
    private directionService: DirectionService
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
