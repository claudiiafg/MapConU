import { Injectable } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { IndoorDirectionsService } from './indoorDirections.service';
import { DirectionService } from './direction.service';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from './translation.service';

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
  public isInRoute = new BehaviorSubject(false);
  private currentStep: any;

  constructor(
    private events: Events,
    private indoorDirections: IndoorDirectionsService,
    private outdoorDirections: DirectionService,
    private alertController: AlertController,
    private translate: TranslationService
  ) {
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    //when all components of map have been set, route can begging
    this.events.subscribe('map-set', res => {
      if (this.isInRoute.getValue() === true) {
        const data = {
          source: this.currentStep.source,
          destination: this.currentStep.dest
        };
        this.events.publish('init-new-path', data, Date.now());
      }
    });
  }

  public resetSteps() {
    this.isInRoute.next(false);
    this.steps = [];
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
        this.initDifferentFloorDir(true, building, destination, points);
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

      this.events.publish('classToClass', data, Date.now());
    }
  }

  //helper
  public getIsSelectMode(): boolean {
    return this.isSelectMode;
  }

  public setSelectMode(value: boolean) {
    this.isSelectMode = value;
  }

  //setup steps of route
  initDifferentFloorDir(
    isInit: boolean,
    floor: string,
    interest: string,
    points: any[]
  ) {
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
    this.isInRoute.next(true);
  }

  //get next step to perform, perform it and set it as done
  public getNextStep() {
    let i = 0;
    for (i = 0; i < this.steps.length; i++) {
      if (!this.steps[i].wasDone) {
        this.steps[i].wasDone = true;
        break;
      }
    }
    this.changeFloor(this.steps[i].floor);
    this.currentStep = this.steps[i];
    return this.currentStep;
  }

  private changeFloor(building: any) {
    //if isInRoute -> change floor to the input value of bulding
    if (this.isInRoute.getValue() === true) {
      if (building === 'h8') {
        this.events.publish('floor-changes', 8, Date.now());
      } else {
        this.events.publish('floor-changes', 9, Date.now());
      }

      //if NOT isInRoute -> change floor to the other possiblr floor
    } else {
      if (building === 'h8') {
        this.events.publish('floor-changes', 9, Date.now());
      } else {
        this.events.publish('floor-changes', 8, Date.now());
      }
    }
  }
}
