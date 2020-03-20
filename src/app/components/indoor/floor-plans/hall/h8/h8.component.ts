import { Component} from '@angular/core';
import { Events } from '@ionic/angular';
import { TranslationService} from "../../../../../../services/translation.service";

@Component({
  selector: 'h8-floor-plan',
  templateUrl: 'h8.component.html',
  styleUrls: ['./h8.component.scss']
})
export class H8FloorPlanComponent {

  constructor(
    private events: Events,
    private translate: TranslationService
  ) {}

  ngAfterViewInit(){
    this.events.publish('floor-loaded', Date.now());
  }
  async showPopover() {
    const alert = await this.alertController.create({
      header: this.translate.getTranslation('find-way'),
      cssClass: 'alert-css',
      buttons: [
        {
          text: this.translate.getTranslation('fm-escalator'),
          role: 'escalator-up'
        },
        {
          text: this.translate.getTranslation('chose-src'),
          role: 'choose'
        }
      ]
    });
  }
}
