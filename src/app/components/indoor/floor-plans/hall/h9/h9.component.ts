import { Component, HostListener } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'h9-floor-plan',
  templateUrl: 'h9.component.html',
  styleUrls: ['./h9.component.scss']
})
export class H9FloorPlanComponent {
  constructor(private events: Events) {}

  ngAfterViewInit() {
    this.events.publish('floor-loaded', {building: 'hall', floor: '9'}, Date.now());
  }

  @HostListener('unloaded')
  ngOnDestroy() {}
}
