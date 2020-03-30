import { Component, OnInit, HostListener } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'mb1-floor-plan',
  templateUrl: 'mb1.component.html',
  styleUrls: ['./mb1.component.scss']
})
export class MB1FloorPlanComponent {
  constructor(private events: Events) {}

  ngAfterViewInit() {
    console.log('lalal');
    this.events.publish('floor-loaded', {building: 'jmsb', floor: '1'}, Date.now());
  }

  @HostListener('unloaded')
  ngOnDestroy() {}
}
