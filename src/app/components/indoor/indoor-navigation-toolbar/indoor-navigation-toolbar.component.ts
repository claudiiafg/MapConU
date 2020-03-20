import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../../services/data-sharing.service';
import { Events } from '@ionic/angular';
import { TranslationService} from "../../../../services/translation.service";

@Component({
  selector: 'app-indoor-navigation-toolbar',
  templateUrl: './indoor-navigation-toolbar.component.html',
  styleUrls: ['./indoor-navigation-toolbar.component.scss']
})
export class IndoorNavigationToolbarComponent {
  @Input() inputBuilding: string;
  @Input() floor: any = 8;
  @Input() isSelectMode: boolean = false;

  private maxFloorIndex: number;
  private minFloorIndex: number;
  private currentFloorIndex: number;
  private building: string;

  // Array with building information to dynamically create a toolbar with the proper building name and floors
  private buildingInfo = [
    { buildingName: 'Hall Building', topFloorIndex: 10, bottomFloorIndex: 9 },
    {
      buildingName: 'John Molson Building',
      topFloorIndex: 2,
      bottomFloorIndex: 2
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
    private router: Router,
    private events: Events,
    private translate: TranslationService
  ){}

  ngAfterViewInit(){
    //placeholder because logic to come from outdoor-nav is not implemented yet can be deleted when it is
    switch (this.inputBuilding) {
      case 'hall':
        this.building = this.translate.getTranslation('Hall Building');
        break;
      case 'jmsb':
        this.building = this.translate.getTranslation('John Molson Building');
        break;
      case 'fg':
        this.building = this.translate.getTranslation('Faubourg');
        break;
      case 'richard':
        this.building = this.translate.getTranslation('Richard Grey Renaud Science Complex');
        break;
      case 'center':
        this.building = this.translate.getTranslation('Central Building');
        break;
      case 'hh':
        this.building = this.translate.getTranslation('Higston Hall');
        break;
      case 'comm':
        this.building = this.translate.getTranslation('Communication Studies and Journalism Building');
        break;
      case 'varnier':
        this.building = this.translate.getTranslation('Vanier Extension');
        break;
    }

    //sets max and min number of allowed floors for the selected building
    for(let building of this.buildingInfo){
      if(building.buildingName === this.building){
        this.maxFloorIndex = building.topFloorIndex;
        this.minFloorIndex = building.bottomFloorIndex;
        break;
      }
    }
    this.currentFloorIndex = this.floors.indexOf(JSON.stringify(this.floor));
  }

  // Method to update the floor when the user selects a floor from the dropdown menu
  private changeFloor() {
    this.events.publish('floor-changes', this.floor, Date.now());
    this.currentFloorIndex = this.floors.indexOf(JSON.stringify(this.floor));
  }

  // Method to move one floor up
  private moveUpFloor() {
    if (this.currentFloorIndex < this.maxFloorIndex) {
      this.currentFloorIndex++;
      this.floor = this.floors[this.currentFloorIndex];
      this.events.publish('floor-changes', this.floor, Date.now());
    }
  }

  // Method to move one floor down
  private moveDownFloor() {
    if (this.currentFloorIndex > this.minFloorIndex) {
      this.currentFloorIndex--;
      this.floor = this.floors[this.currentFloorIndex];
      this.events.publish('floor-changes', this.floor, Date.now());
    }
  }

  // Takes the user back to the outdoor view
  private goBackOutside() {
    if(this.isSelectMode){
      this.events.publish('isSelectMode', false, Date.now());
    } else {
      this.router.navigateByUrl('/outdoor');
    }
  }

  // Takes the user to the settings page
  private adjustSettings(){
    this.router.navigateByUrl('/appSettings');
  }
}
