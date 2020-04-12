import { Component, HostListener } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'h8-floor-plan',
  templateUrl: 'h8.component.html',
  styleUrls: ['./h8.component.scss']
})
export class H8FloorPlanComponent {
  constructor(private events: Events) {}

  ngAfterViewInit() {
    //indoo-map.component is subscribe to it
    //when html of floor is loaded, the map may be set with new information
    this.events.publish('floor-loaded', {building: 'hall', floor: '8'}, Date.now());
  }

  //destroy component on unload so the ngAfterViewInit get's triggered everytime the floorplan is openned
  @HostListener('unloaded')
  ngOnDestroy() {}
}
