import {Component, OnInit,} from '@angular/core';
import {DataSharingService} from "../../services/data-sharing.service";

@Component({
  selector: 'app-outdoor-navigation-toolbar',
  templateUrl: './outdoor-navigation-toolbar.component.html',
  styleUrls: ['./outdoor-navigation-toolbar.component.scss'],
})

export class OutdoorNavigationToolbarComponent implements OnInit {
  loc: string;
  message;

  //Array for lat, long of specific locations
  locations = [
    { latitude: 45.495729, longitude: -73.578041 },
    { latitude: 45.458240, longitude: -73.640452 }
  ];

  constructor(private data: DataSharingService) {
    this.data.currentMessage.subscribe(incomingMessage => this.message = incomingMessage);
  }
  
  ngOnInit() { }

  sendMessage(updatedMessage){
    this.data.updateMessage(updatedMessage);
  }

  public changeCampus() {
    this.sendMessage(this.locations[this.loc]);
    console.log("this is the msg" + this.message.longitude + ", " + this.message.latitude);
    console.log(typeof(this.message.latitude));
  }

}
