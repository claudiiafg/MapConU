import { Injectable } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { IndoorDirectionsService } from './indoorDirections.service';
import { DirectionService } from './direction.service';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from './translation.service';
import { Router } from '@angular/router';
import { DataSharingService } from './data-sharing.service';

enum Mode {
  indoor,
  outdoor,
  mixed
}

enum IndoorDirectionsType {
  sameFloor,
  differentFloor
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
  private directionsMode: Mode;
  private indoorType: IndoorDirectionsType;
  private outdoorType: OutdoorDirectionsType;
  private mixedType: MixedDirectionsType;
  private steps: any[] = [];
  private isSelectMode: boolean = false;
  public isIndoorInRoute = new BehaviorSubject(false);
  public isMixedInRoute = new BehaviorSubject(false);
  private currentStep: any;
  private pathHasBeenInit: boolean = false;

  constructor(
    private events: Events,
    private indoorDirections: IndoorDirectionsService,
    private outdoorDirections: DirectionService,
    private alertController: AlertController,
    private translate: TranslationService,
    private router: Router,
    private dataSharingService: DataSharingService,
  ) {
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    //when all components of map have been set, route can begging
    this.events.subscribe('map-set', res => {
      if (this.isIndoorInRoute.getValue() === true && !this.pathHasBeenInit) {
        this.initNewPath()
      }
    });

    this.isMixedInRoute.subscribe(res => {
      if(res === true){
        let building;
        if(this.steps[0].floor){
          building = (this.steps[0].floor === 'mb1') ? 'jmsb' : 'hall';
        }
        this.router.navigateByUrl('indoor/' + building);
      }
    });
  }

  private initNewPath(){
    if(!this.currentStep){
      this.currentStep = this.steps[0];
    }
    const data = {
      source: this.currentStep.source,
      destination: this.currentStep.dest
    };
    console.log(this.steps);
    this.events.publish('init-new-path', data, Date.now());
    this.pathHasBeenInit = true;
  }

  //open popup to input type of directions wanted
  public async initiateIndoorDirections(
    building: string,
    destination: string,
    points: any[]
  ) {
    let defaultStartingPoint: string;
    if (building === 'h8' || building === 'h9') {
      defaultStartingPoint = 'escalators-up';
    } else if (building === 'mb1') {
      defaultStartingPoint = 'entrance';
    }

    const alert = await this.alertController.create({
      header: this.translate.getTranslation('find-way'),
      cssClass: 'alert-css',
      buttons: [
        {
          text: this.translate.getTranslation('this-floor'),
          role: 'sameFloor'
        },
        {
          text: this.translate.getTranslation('another-floor'),
          role: 'diffFloor'
        },
        {
          text: this.translate.getTranslation('another-building'),
          role: 'diffBuilding'
        }
      ]
    });

    await alert.present().then(() => {
      /** disable the different floor is mb1 */
      if (building === 'mb1') {
        document
          .querySelector(
            'ion-alert div.alert-button-group button:nth-of-type(2)'
          )
          .setAttribute('disabled', 'true');
        return;
      }
    });

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
      if (building.indexOf('h') === 0) {
        this.initDifferentFloorDir(true, building, destination);
        this.isSelectMode = true;
        this.events.publish('isSelectMode', true, Date.now());
        //since only building with different floors available, okay to hardcode behavior for now
        this.changeFloor(building);
      } else {
        console.error('NO OTHER FLOORS AVAILABLE'); //make popup (or button disabled)
      }

      //if want to find from this to another building
    } else if (result.role === 'diffBuilding') {
      const data = {
        destination: destination
      };
      console.log(building);
      this.initDifferentBuilding(true, building, destination);
    }
  }

  private initDifferentBuilding(isInit: boolean, floor: string, interest: string){
    if(isInit){
      this.steps = [];
    }
    let dest : string = '';
    if(floor === 'h8'){
      dest = 'escalators-down';

    } else if(floor === 'h9'){
      dest = 'escalators-down';
      const tempPath = {
        floor: floor,
        source: interest,
        dest: dest,
        wasDone: false
      };
      this.steps.push(tempPath);
      this.initDifferentBuilding(false, 'h8', 'escalators-down');
      return;
    } else if(floor === 'mb1'){
      dest = 'entrance';
    }
    const tempPath = {
      floor: floor,
      source: interest,
      dest: dest,
      wasDone: false
    };
    this.steps.push(tempPath);
    console.log(this.steps);
    this.getOutsideInfo(floor);
  }

  //setup steps of route
  public initDifferentFloorDir(
    isInit: boolean,
    floor: string,
    interest: string) {
    //if initiating floor to floor, store information and navigate user to the other floor (to choose source)
    if (isInit) {
      this.steps = [];
      let dest: string = floor === 'h8' ? 'escalators-up' : 'escalators-down';
      const tempPath = {
        floor: floor,
        source: interest,
        dest: dest,
        wasDone: false
      };
      this.steps.push(tempPath);

      //ask user to choose source and initiate the path steps
    } else {
      let source: string = floor === 'h8' ? 'escalators-down' : 'escalators-up';
      const tempPath = {
        floor: floor,
        source: source,
        dest: interest,
        wasDone: false,
        isLast: true
      };
      this.steps.push(tempPath);
      this.initiatePathSteps();
    }
    console.log(this.steps);
  }

  private initiatePathSteps() {
    this.isIndoorInRoute.next(true);
  }

  private getOutsideInfo(floor: string){
    let id = (floor === 'mb1') ? 'jmsb' : 'hall';
    this.router.navigateByUrl('/outdoor/isMixedNav/' + id);
  }

  private changeFloor(building: any) {
    //if isIndoorInRoute -> change floor to the input value of bulding
    if (this.isIndoorInRoute.getValue() === true) {
      if (building === 'h8') {
        this.events.publish('floor-changes', 8, Date.now());
      } else if (building === 'h9') {
        this.events.publish('floor-changes', 9, Date.now());
      } else {
        return;
      }

      //if NOT isIndoorInRoute -> change floor to the other possiblr floor
    } else {
      if (building === 'h8') {
        this.events.publish('floor-changes', 9, Date.now());
      } else if (building === 'h9') {
        this.events.publish('floor-changes', 8, Date.now());
      } else {
        return;
      }
    }
  }

  //helper
  public getIsSelectMode(): boolean {
    return this.isSelectMode;
  }

  public setSelectMode(value: boolean) {
    this.isSelectMode = value;
  }

  public pushStep(step: any){
    if(step.source && step.dest){
      this.steps.push(step);
    } else {
      throw new Error('Must set source and destination in order to push a a new navigation step.');
    }
  }

  public resetSteps() {
    this.pathHasBeenInit = false;
    this.isIndoorInRoute.next(false);
    this.isMixedInRoute.next(false);
    this.steps = [];
  }

  public getHallFloor() : number{
    if(this.steps[0].floor.includes('h')){
      return (this.steps[0].floor === 'h8') ? 8 : 9;
    } else {
      throw new Error('First step is not in the hall building');
    }
  }

  //get next step to perform, perform it and set it as done
  public getNextStep() {
    if(!this.pathHasBeenInit){
      this.initNewPath();
    }
    let i = 0;
    for (i = 0; i < this.steps.length; i++) {
      if (!this.steps[i].wasDone) {
        this.steps[i].wasDone = true;
        break;
      }
    }
    this.currentStep = this.steps[i];
    if(this.currentStep.floor){
      this.changeFloor(this.currentStep);
    }
    return this.currentStep;
  }

  public continueWithOutdoorDirection(){
    if(this.currentStep && !this.currentStep.floor){
      this.outdoorDirections.isDirectionSet.next(true);
      if (this.outdoorDirections.alternateDirection) {
        this.outdoorDirections.alternateDirection.set('directions', null);
        this.outdoorDirections.alternateDirectionSet = false;
      }
      this.dataSharingService.updateMapSize(-210);
      this.outdoorDirections.origin.next([this.currentStep.source.lat, this.currentStep.source.lng]);
      this.outdoorDirections.destination.next([this.currentStep.dest.lat, this.currentStep.dest.lng]);

      this.router.navigateByUrl('/outside');

    } else {
      throw new Error("If there's a floor in the current step, navigation shouldn't go outside");
    }
  }

}
