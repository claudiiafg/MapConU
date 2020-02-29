import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-indoor-map',
  templateUrl: './indoor-map.component.html',
  styleUrls: ['./indoor-map.component.scss']
})
export class IndoorMapComponent implements OnInit {
  @Input() inputBuilding: string = '';
  @Input() floor: any;

  constructor(private events: Events) {
    this.events.subscribe('floor-changes', (res) => {
      if(res){
        this.floor = res;
      }
    });
  }

  ngOnInit() {}
}
