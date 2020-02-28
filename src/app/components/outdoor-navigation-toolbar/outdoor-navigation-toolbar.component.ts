import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { DataSharingService } from '../../../services/data-sharing.service';
import { DirectionService } from 'src/services/direction.service';

@Component({
  selector: 'app-outdoor-navigation-toolbar',
  templateUrl: './outdoor-navigation-toolbar.component.html',
  styleUrls: ['./outdoor-navigation-toolbar.component.scss']
})
export class OutdoorNavigationToolbarComponent implements OnInit {
  public loc: string;
  public message: any;
  public isDirectionSet: boolean = false;
  public transitColor: string = 'white';
  public carColor: string = 'white';
  public walkColor: string = 'blue';

  //Array for lat, long of specific locations
  public locations = [
    { latitude: 45.495729, longitude: -73.578041 },
    { latitude: 45.45824, longitude: -73.640452 }
  ];

  constructor(
    private data: DataSharingService,
    private events: Events,
    public directionService: DirectionService
  ) {
    this.data.currentMessage.subscribe(
      incomingMessage => (this.message = incomingMessage)
    );
    this.directionService.isDirectionSet.subscribe(isDirectionSet => {
      this.isDirectionSet = isDirectionSet;
    });
  }

  ngOnInit() {}

  sendMessage(updatedMessage) {
    this.data.updateMessage(updatedMessage);
  }

  public changeCampus() {
    this.sendMessage(this.locations[this.loc]);
    this.events.publish('campusChanged', Date.now());
  }

  public changeTravelMode(travelMode: string) {
    this.setSelectedColor(travelMode);
    this.directionService.changeTravelMode.next(travelMode);
  }

  public setSelectedColor(travelMode: string) {
    if (travelMode === 'car') {
      this.carColor = 'blue';
      this.transitColor = 'white';
      this.walkColor = 'white';
    } else if (travelMode === 'transit') {
      this.carColor = 'white';
      this.transitColor = 'blue';
      this.walkColor = 'white';
    } else {
      this.carColor = 'white';
      this.transitColor = 'white';
      this.walkColor = 'blue';
    }
  }
}
