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
    //indoo-map.component is subscribe to it
    //when html of floor is loaded, the map may be set with new information
    this.events.publish('floor-loaded', {building: 'jmsb', floor: '1'}, Date.now());
  }

  //destroy component on unload so the ngAfterViewInit get's triggered everytime the floorplan is openned
  @HostListener('unloaded')
  ngOnDestroy() {}
}
