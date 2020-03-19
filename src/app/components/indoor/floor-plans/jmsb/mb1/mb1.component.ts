import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'mb1-floor-plan',
  templateUrl: 'mb1.component.html',
  styleUrls: ['./mb1.component.scss']
})
export class MB1FloorPlanComponent implements OnInit {

  constructor(
    private events: Events,
  ) {}

  ngAfterViewInit(){
    this.events.publish('floor-loaded', Date.now());
  }

  ngOnInit() {}

}
