import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-directions',
  templateUrl: './modal-directions.component.html',
  styleUrls: ['./modal-directions.component.scss']
})
export class ModalDirectionsComponent implements OnInit {
  @Input() steps: any;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  public dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
