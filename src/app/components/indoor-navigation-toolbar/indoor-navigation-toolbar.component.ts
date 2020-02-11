import {Component, NgModule, OnInit} from '@angular/core';
import {DataSharingService} from "../../../services/data-sharing.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-indoor-navigation-toolbar',
  templateUrl: './indoor-navigation-toolbar.component.html',
  styleUrls: ['./indoor-navigation-toolbar.component.scss'],
})

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})

export class IndoorNavigationToolbarComponent implements OnInit {
  building: string;
  maxFloors: number;
  currentFloor: number;
  updateFloor: number;

  //number of floors in the building
  //TODO: add all buildings and the floors with floor plans

  buildingInfo = [
    {buildingName: "Hall Building", numFloors: 9},
    {buildingName: "John Molson Building", numFloors: 4}
  ];

  floors = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ];

  constructor(private data: DataSharingService) {
    //TODO: when user selects building to enter the name of that building needs to be sent to initialize the indoor view
    this.data.currentMessage.subscribe(
        incomingMessage => (this.building = incomingMessage)
    );
    this.ngOnInit()
  }

  ngOnInit() {
    //placeholder because logic to come from outdoor-nav is not implemented yet can be deleted when it is
    this.building = "Hall Building";

    //sets max number of allowed floors for the selected building
    let i;
    let length = this.buildingInfo.length;
    for (i = 0; i < length; i++) {
      if (this.buildingInfo[i].buildingName === this.building) {
        this.maxFloors = this.buildingInfo[i].numFloors;
        break;
      }
    }
    this.currentFloor = 1;

  }

  changeFloor() {
    this.currentFloor = this.updateFloor;
  }

  moveUpFloor() {
    if (this.currentFloor < this.maxFloors) {
      this.currentFloor++;
    }
  }

  moveDownFloor() {
    if (this.currentFloor > 1) {
      this.currentFloor--;
    }
  }
}
