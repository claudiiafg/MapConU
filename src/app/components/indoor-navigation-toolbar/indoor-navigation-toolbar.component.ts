import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../services/data-sharing.service';

@Component({
  selector: 'app-indoor-navigation-toolbar',
  templateUrl: './indoor-navigation-toolbar.component.html',
  styleUrls: ['./indoor-navigation-toolbar.component.scss']
})
export class IndoorNavigationToolbarComponent implements OnInit {
  building: string;
  maxFloorIndex: number;
  minFloorIndex: number;
  currentFloor: string;
  currentFloorIndex: number;
  updateFloor: string;

  //number of floors in the building
  //TODO: add all buildings and the floors with floor plans

  /*
  Array with building information to dynamically create a toolbar with the proper building name and floors
   */
  buildingInfo = [
    { buildingName: 'Hall Building', topFloorIndex: 12, bottomFloorIndex: 2 },
    {
      buildingName: 'John Molson Building',
      topFloorIndex: 6,
      bottomFloorIndex: 0
    },
    { buildingName: 'Faubourg', topFloorIndex: 2, bottomFloorIndex: 0 },
    {
      buildingName: 'Richard Grey Renaud Science Complex',
      topFloorIndex: 7,
      bottomFloorIndex: 1
    },
    { buildingName: 'Central Building', topFloorIndex: 3, bottomFloorIndex: 2 },
    { buildingName: 'Higston Hall', topFloorIndex: 2, bottomFloorIndex: 2 },
    {
      buildingName: 'Communication Studies and Journalism Building ',
      topFloorIndex: 5,
      bottomFloorIndex: 2
    },
    { buildingName: 'Vanier Extension', topFloorIndex: 5, bottomFloorIndex: 2 }
  ];

  floors = ['s2', 's1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  constructor(private data: DataSharingService, private router: Router) {
    //TODO: when user selects building to enter the name of that building needs to be sent to initialize the indoor view
    this.data.currentMessage.subscribe(
      incomingMessage => (this.building = incomingMessage)
    );
    this.ngOnInit();
  }

  ngOnInit() {
    //placeholder because logic to come from outdoor-nav is not implemented yet can be deleted when it is
    this.building = 'Hall Building';

    //sets max and min number of allowed floors for the selected building
    let i;
    let length = this.buildingInfo.length;
    for (i = 0; i < length; i++) {
      if (this.buildingInfo[i].buildingName === this.building) {
        this.maxFloorIndex = this.buildingInfo[i].topFloorIndex;
        this.minFloorIndex = this.buildingInfo[i].bottomFloorIndex;
        break;
      }
    }
    this.currentFloor = '1';
    this.currentFloorIndex = 2;
  }

  /*
  method to update the floor when the user selects a floor from the dropdown menu
   */
  changeFloor() {
    this.currentFloor = this.updateFloor;
    let i;
    length = this.floors.length;

    for (i = 0; i < length; i++) {
      if (this.floors[i] === this.currentFloor) {
        this.currentFloorIndex = i;
        break;
      }
    }
  }

  /*
  Method to move one floor up
   */
  moveUpFloor() {
    if (this.currentFloorIndex < this.maxFloorIndex) {
      this.currentFloorIndex++;
      this.currentFloor = this.floors[this.currentFloorIndex];
    }
  }

  /*
  Method to move one floor down
   */
  moveDownFloor() {
    if (this.currentFloorIndex > this.minFloorIndex) {
      this.currentFloorIndex--;
      this.currentFloor = this.floors[this.currentFloorIndex];
    }
  }

  /*
  Takes the user back to the outdoor view
   */
  goBackOutside() {
    this.router.navigateByUrl('/outdoor');
  }
}
