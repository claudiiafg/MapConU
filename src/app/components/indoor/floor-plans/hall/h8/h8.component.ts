import { Component } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'h8-floor-plan',
  templateUrl: 'h8.component.html',
  styleUrls: ['./h8.component.scss']
})
export class H8FloorPlanComponent {
  constructor(private events: Events) {}

  ngAfterViewInit() {
    this.events.publish('floor-loaded', {building: 'hall', floor: '8'}, Date.now());
  }
}
