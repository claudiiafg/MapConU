import { Injectable } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { IndoorDirectionsService } from './indoorDirections.service';
import { DirectionService } from './direction.service';

enum Mode {
  indoor,
  outdoor,
  mixed
}

enum IndoorDirectionsType {
  sameFloor,
  differentFloor,
}

enum OutdoorDirectionsType {
  buildingToBuilding
}

enum MixedDirectionsType {
  floorToBuilding,
  buildingToFloor,
  classToClass
}

@Injectable()
export class DirectionsManagerService {
  private directionsMode : Mode;
  private indoorType : IndoorDirectionsType;
  private outdoorType : OutdoorDirectionsType;
  private mixedType : MixedDirectionsType;
  private steps : any[] = [];
  private isSelectMode: boolean = false;


  constructor(
    private events: Events,
    private indoorDirections: IndoorDirectionsService,
    private outdoorDirections: DirectionService,
    private alertController: AlertController,

  ) {}


  public setSameFloor(){

  }

  public setOutdoor(){

  }

  public setMixed(type : MixedDirectionsType){

  }

  public async initiateIndoorDirections(building: string, destination: string, points : any[]) {
    let defaultStartingPoint: string;
    if(building === 'h8'){
      defaultStartingPoint = 'h8-escalator-up';
    } else if(building === 'mb1'){
      defaultStartingPoint = 'entrance';
    }

    const alert = await this.alertController.create({
      header: 'Where do you wish to know directions from?',
      cssClass: 'alert-css',
      buttons: [
        {
          text: 'This floor',
          role: 'sameFloor'
        },
        {
          text: 'Another floor',
          role: 'diffFloor'
        },
        {
          text: 'Another building',
          role: 'diffBuilding'
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();

    //if want to find path within the same (current) floor
    if (result.role === 'sameFloor') {
      this.indoorType = IndoorDirectionsType.sameFloor;
      const data = {
        source: defaultStartingPoint,
        destination: destination,
        points: points
      };
      this.events.publish('open-indoor-popup', data, Date.now());

    //if want to find from this to another floor
    } else if (result.role === 'diffFloor') {
      this.indoorType = IndoorDirectionsType.differentFloor;
      if(building.indexOf('h') === 0){
        this.initDifferentFloorDir(true, building, destination, points);
        this.isSelectMode = true;
        this.events.publish('isSelectMode', true, Date.now());
        //since only building with different floors available, okay to hardcode behavior for now
        if(building === 'h8'){
          this.events.publish('floor-changes', 9, Date.now());

        } else {
          this.events.publish('floor-changes', 8, Date.now());

        }

      } else {
        console.error('NO OTHER FLOORS AVAILABLE'); //make popup (or button disabled)
      }

    //if want to find from this to another building
    } else if (result.role === 'diffBuilding') {
      const data = {
        destination: destination
      }

      this.events.publish('classToClass', data, Date.now());
    }
  }

  public getIsSelectMode() : boolean {
    return this.isSelectMode;
  }


  initDifferentFloorDir(isInit: boolean, floor: string, interest: string, points: any[]){
    //if initiating floor to floor, store information and navigate user to the other floor (to choose source)
    if(isInit){
      let dest: string = (floor === 'h8') ? 'h8-escalators-up' : 'h9-escalators-down';
      const tempPath = {
        floor: floor,
        source: interest,
        dest: dest
      }
      this.steps.push(tempPath);

    //ask user to choose source and initiate the path steps
    } else {
      let source: string = (floor === 'h8') ? 'h8-escalators-down' : 'h9-escalators-up';
      const tempPath = {
        floor: floor,
        source: source,
        dest: interest
      }
      this.steps.push(tempPath);
      this.initiatePathSteps();
    }
  }

  initiatePathSteps(){
    console.log(this.steps);

  }

  resetPathSteps(){
    this.steps = [];
  }



}
