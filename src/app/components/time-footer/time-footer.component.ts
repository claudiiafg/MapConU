import { Component, OnInit } from '@angular/core';
import { DirectionService } from 'src/services/direction.service';
import { ModalController } from '@ionic/angular';
import { ModalDirectionsComponent } from '../modal-directions/modal-directions.component';

@Component({
  selector: 'app-time-footer',
  templateUrl: './time-footer.component.html',
  styleUrls: ['./time-footer.component.scss']
})
export class TimeFooterComponent implements OnInit {
  public isDirectionSet = false;
  public timeLeft: number;
  public distance: number;
  public arrival: string;
  constructor(
    public modalController: ModalController,
    private directionService: DirectionService
  ) {
    this.directionService.isDirectionSet.subscribe(isDirectionSet => {
      this.isDirectionSet = isDirectionSet;
    });
  }

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalDirectionsComponent
    });
    return await modal.present();
  }
}
