import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../../services/data-sharing.service';
import { Events } from '@ionic/angular';
import { DirectionsManagerService } from 'src/services/directionsManager.service';

@Component({
  selector: 'app-indoor-navigation-toolbar',
  templateUrl: './indoor-navigation-toolbar.component.html',
  styleUrls: ['./indoor-navigation-toolbar.component.scss']
})
export class IndoorNavigationToolbarComponent implements OnInit {
  @Input() inputBuilding: string = '';
  @Input() floor: string = '1';

  private building: string;
  private maxFloorIndex: number;
  private minFloorIndex: number;
  private currentFloor: string;
  private currentFloorIndex: number;
  private updateFloor: string;
  private isSelectMode : boolean = false;

  //number of floors in the building
  //TODO: add all buildings and the floors with floor plans

  /*
  Array with building information to dynamically create a toolbar with the proper building name and floors
   */
  private buildingInfo = [
    { buildingName: 'Hall Building', topFloorIndex: 11, bottomFloorIndex: 2 },
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
      buildingName: 'Communication Studies and Journalism Building',
      topFloorIndex: 5,
      bottomFloorIndex: 2
    },
    { buildingName: 'Vanier Extension', topFloorIndex: 5, bottomFloorIndex: 2 }
  ];

  private floors = ['s2', 's1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  constructor(
    private data: DataSharingService,
    private router: Router,
    private events: Events,
    private directionsManager : DirectionsManagerService,
  ) {
    //TODO: when user selects building to enter the name of that building needs to be sent to initialize the indoor view
    this.data.currentMessage.subscribe(
      incomingMessage => (this.building = incomingMessage)
    );
    this.ngOnInit();
  }

  ngOnInit() {

    this.events.subscribe('isSelectMode', (res) => {
      this.isSelectMode = res;
      this.updateFloor = this.floor;
      this.changeFloor();
    })
    //placeholder because logic to come from outdoor-nav is not implemented yet can be deleted when it is
    switch (this.inputBuilding) {
      case 'hall':
        this.building = 'Hall Building';
        break;
      case 'jmsb':
        this.building = 'John Molson Building';
        break;
      case 'fg':
        this.building = 'Faubourg';
        break;
      case 'richard':
        this.building = 'Richard Grey Renaud Science Complex';
        break;
      case 'center':
        this.building = 'Central Building';
        break;
      case 'hh':
        this.building = 'Higston Hall';
        break;
      case 'comm':
        this.building = 'Communication Studies and Journalism Building';
        break;
      case 'varnier':
        this.building = 'Vanier Extension';
        break;
    }

    //sets max and min number of allowed floors for the selected building
    let i;
    let length = this.buildingInfo.length;
    let building = this.buildingInfo.filter(building => building.buildingName === this.building)[0];
    if (building){
      this.maxFloorIndex = building.topFloorIndex;
      this.minFloorIndex = building.bottomFloorIndex;
    }
    this.currentFloor = this.floor;
    this.currentFloorIndex = parseInt(this.floor);
  }

  /*
  method to update the floor when the user selects a floor from the dropdown menu
   */
  private changeFloor() {
    this.currentFloor = this.updateFloor;
    this.events.publish('floor-changes', this.currentFloor, Date.now());
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
  private moveUpFloor() {
    if (this.currentFloorIndex < this.maxFloorIndex) {
      this.currentFloorIndex++;
      this.currentFloor = this.floors[this.currentFloorIndex];
      this.events.publish('floor-changes', this.currentFloor, Date.now());
    }
  }

  /*
  Method to move one floor down
   */
  private moveDownFloor() {
    if (this.currentFloorIndex > this.minFloorIndex) {
      this.currentFloorIndex--;
      this.currentFloor = this.floors[this.currentFloorIndex];
      this.events.publish('floor-changes', this.currentFloor, Date.now());
    }
  }

  /*
  Takes the user back to the outdoor view
   */
  private goBackOutside() {
    if(this.isSelectMode){
      this.events.publish('isSelectMode', false, Date.now());
      this.directionsManager.resetPathSteps();
    } else {
      this.router.navigateByUrl('/outdoor');
    }
  }
  /*
  Takes the user to the settings page
  */
  private adjustSettings(){
    this.router.navigateByUrl('/appSettings');
  }
}
