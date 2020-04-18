import { Injectable } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { IndoorDirectionsService } from './indoorDirections.service';
import { DirectionService } from './direction.service';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from './translation.service';
import { Router } from '@angular/router';
import { DataSharingService } from './data-sharing.service';
import { GeolocationServices } from './geolocation.services';

export enum MixedDirectionsType {
  floorToBuilding,
  buildingToFloor,
  classToClass
}

@Injectable()
export class DirectionsManagerService {
  private mixedType: MixedDirectionsType;
  private steps: any[] = [];
  private isSelectMode: boolean = false;
  public isIndoorInRoute = new BehaviorSubject(false);
  public isMixedInRoute = new BehaviorSubject(false);
  private currentStep: any;
  private pathHasBeenInit: boolean = false;
  private hallCoords = {
    lat: 45.496836,
    lng: -73.578858
  };

  private jmsbCoords = {
    lat: 45.495531,
    lng: -73.579197
  };
  public handicapRequest: boolean = false;
  constructor(
    private events: Events,
    private indoorDirections: IndoorDirectionsService,
    private outdoorDirections: DirectionService,
    private alertController: AlertController,
    private translate: TranslationService,
    private router: Router,
    private dataSharingService: DataSharingService,
    private geolocationService: GeolocationServices
  ) {
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    //when all components of map have been set, route can begin
      //indoor-map.component publishes event after floorplan has been loaded and map has been set
      //indoor-page publishes event when floor was already loaded and map set, but path no initiated, so to initiate it
    this.events.subscribe('map-set', res => {
      if (this.isIndoorInRoute.getValue() === true || this.isMixedInRoute.getValue() === true ) {
        this.initNewPath();
      }
    });

    //subscribe to directions currently in place
    //mixedInRoute means the steps in direction have both floor plans and outside paths
    this.isMixedInRoute.subscribe(res => {
      if(res === true){
        let building;
        //if first step is indoor (has a floor)
        if(this.steps[0].floor){
          //get building
          building = (this.steps[0].floor === 'mb1') ? 'jmsb' : 'hall';
        }
        //route to that building
        this.router.navigateByUrl('indoor/' + building);
      }
    });
  }

  //triggered after floorplan has been loaded, map has been set and there's directions on route
  //initiate path in the current floorplan
  private initNewPath(){
    if(!this.stepsBeenInit || !this.currentStep){
      this.currentStep = this.steps[0];
    }

    const data = {
      source: this.currentStep.source,
      destination: this.currentStep.dest
    };
    this.events.publish('init-new-path', data, Date.now());
    this.pathHasBeenInit = true;
  }

  //open popup to input type of directions wanted
  //triggered in the indoor-map.component when room has been clicked on
  public async initiateIndoorDirections(
    building: string,
    destination: string,
    points: any[]
  ) {
    let defaultStartingPoint: string;
    if (building === 'h8' || building === 'h9') {
      if(this.handicapRequest){
        defaultStartingPoint = 'elevators';
      }else{
        defaultStartingPoint = 'escalators-up';
      }

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
      const data = {
        source: defaultStartingPoint,
        destination: destination,
        points: this.indoorDirections.getPoints()
      };
      this.events.publish('open-indoor-popup', data, Date.now());

      //if want to find from this to another floor
    } else if (result.role === 'diffFloor') {
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
      this.setMixedType(MixedDirectionsType.floorToBuilding);
      const data = {
        destination: destination
      };
      this.initDifferentBuilding(true, building, destination);
    }
  }

  //user wants to find a path between a classroom and somewhere else other than the current building
  //(either outside or another building)
  private initDifferentBuilding(isInit: boolean, floor: string, interest: string){
    if(isInit){
      this.steps = [];
    }
    let dest : string = '';

    //if its 8th floor, set destination
    if(floor === 'h8'){
      if(this.handicapRequest){
        dest = 'elevators';
      }else{
        dest = 'escalators-down';
      }


    //if its 9th floor, push 9th floor and recall funtion with 8th floor
    //(in order leave the building, user must go down first)
    } else if(floor === 'h9'){
      if(this.handicapRequest){
        dest = 'elevators';
      }else{
        dest = 'escalators-down';
      }
      const tempPath = {
        floor: floor,
        source: interest,
        dest: dest,
        wasDone: false
      };
      this.steps.push(tempPath);
      if(this.handicapRequest){
        this.initDifferentBuilding(false, 'h8', 'elevators');
      }else{
        this.initDifferentBuilding(false, 'h8', 'escalators-down');
      }

      return;

    //if it's mb, set destination
    } else if(floor === 'mb1'){
      dest = 'entrance';
    }
    const tempPath = {
      floor: floor,
      source: interest,
      dest: dest,
      wasDone: false
    };
    //push step and go outside
    this.steps.push(tempPath);
    this.getOutsideInfo(floor);
  }

  //user wants to find a path within the same building, but on a different floor
  //setup steps of route
  public initDifferentFloorDir(
    isInit: boolean,
    floor: string,
    interest: string) {
    //if initiating floor to floor, store information and navigate user to the other floor (to choose source)
    if (isInit) {
      this.steps = [];
      let dest: string = floor === 'h8' ? 'escalators-up' : 'escalators-down';
      if (this.handicapRequest){
        dest = 'elevators';
      }
      const tempPath = {
        floor: floor,
        source: interest,
        dest: dest,
        wasDone: false
      };
      this.steps.push(tempPath);

    //if not init, the isSelectMode is on -> room clicked will be source
    //ask user to choose source and initiate the path steps
    } else {
      if(floor === 'h9' && this.mixedType === MixedDirectionsType.classToClass){
        const tempPath = {
          floor: 'h8',
          source: 'escalators-up',
          dest: 'escalators-up',
          wasDone: false,
          isLast: false
        };

        if(this.handicapRequest){
          tempPath.source = 'elevators';
          tempPath.dest = 'elevators';
        }

        this.steps.push(tempPath);
      }
      let source: string = (floor === 'h8') ? 'escalators-down' : ((floor === 'h9') ? 'escalators-up' : 'entrance');
      if(this.handicapRequest){
        source = (floor === 'h8') ? 'elevators' : ((floor === 'h9') ? 'elevators' : 'entrance');
      }
      const tempPath = {
        floor: floor,
        source: source,
        dest: interest,
        wasDone: false,
        isLast: true
      };
      this.steps.push(tempPath);

      //since is not init, all steps have bene chosen so path can be initiated
      this.initiatePathSteps();
    }
  }

  private initiatePathSteps() {
    //time footer is subscribed to changes in isIndoorInRoute
    //button clicked in that component will trigger the initiation of path, change of steps and end of path
    this.isIndoorInRoute.next(true);
  }

  //same source building in router url to set the outdoor navigation (origin)
  private getOutsideInfo(floor: string){
    let id = (floor === 'mb1') ? 'jmsb' : 'hall';
    this.router.navigateByUrl('/outdoor/isMixedNav/' + id);
  }

  //change floor, in the same building
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

    //if NOT isIndoorInRoute -> change floor to the other possible floor
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

//************************************HELPERS************************************
  //return if is select mode or not
  public getIsSelectMode(): boolean {
    return this.isSelectMode;
  }

  //set select mode
  public setSelectMode(value: boolean) {
    this.isSelectMode = value;
  }

  //push step in directions
  public pushStep(step: any){
    //step must have source and directions
    if(step.source && step.dest){
      this.steps.push(step);
    } else {
      throw new Error('Must set source and destination in order to push a a new navigation step.');
    }
  }

  //reset all variables
  public resetSteps() {
    this.pathHasBeenInit = false;
    this.isIndoorInRoute.next(false);
    this.isMixedInRoute.next(false);
    this.steps = [];
    this.mixedType = null;
  }

  //get building and floor from step 'floor' attribute
  public getHallFloor() : number{
    if(this.currentStep.floor.includes('h')){
      return (this.currentStep.floor === 'h8') ? 8 : 9;
    } else {
      throw new Error('First step is not in the hall building');
    }
  }

  //get next step to perform, perform it and set it as done
  //called by time-footer, when start or next is pressed
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
    //if out of the loop use last one;
    if(!this.steps[i]){
      i--;
    }
    this.currentStep = this.steps[i];
    if(this.currentStep.floor){
      if(this.router.url.includes('hall') && this.currentStep.floor.includes('h')){
        this.changeFloor(this.currentStep.floor);
      // } else if(this.router.url.includes('jmsb') && this.currentStep.floor.includes('mb1')) {
      //   return this.currentStep;
      } else {
        //THERE A BUG HERE
        this.continueWithIndoorDirections();
      }
    }
    return this.currentStep;
  }

  /*
    What Happens:
      when the arrow in the outdoor-side-buttons is pressed, we get the next step in order to travel inside
      when we get the next step, it is set to wasDone = true
      means that when the floorplan is initiated, that step has already been done and it won't be performed
    This fixes it by:
      when coming from outside during mixedRoute, we'll get the step after outside, although it has been set as done
      and we'll set is as current, in order to perform it.
  */
  public getStepAfterOutdoor(){
    let i = 0;
    for (i = 0; i < this.steps.length; i++) {
      if (i !== 0 && !this.steps[i-1].floor && this.steps[i].floor) {
        this.steps[i].wasDone = true;
        break;
      }
    }
    this.currentStep = this.steps[i];
    this.continueWithIndoorDirections();
    return this.currentStep;
  }

  /*
    Triggered when start is clicked in time-footer
    Although it's not first step, everytime the path starts on a new building, coming from outside
    the start button will show, so to give time for the floor to be loaded and map set
    The user will click on start and we'll perform current step, which has been set in previous funciton (getStepAfterOutdoor)
  */
  public startFromCurrentStep(){
    if(this.currentStep.floor){
      if(this.router.url.includes('hall') && this.currentStep.floor.includes('h')){
        this.changeFloor(this.currentStep.floor);

      } else if(this.router.url.includes('jmsb') && this.currentStep.floor.includes('mb1')) {
        return this.currentStep;

      } else {
        this.continueWithIndoorDirections();
      }
    }
    return this.currentStep;
  }

  //next step in directions is outdoor -> start outdoor directions and navigate outside
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

  //next step in directions is indoor -> check which building and floor needed and more
  public continueWithIndoorDirections(){
    //move outside first so there's a clean start in the next building without any corruption of data
    if(!this.router.url.includes('outdoor')) {
      this.router.navigateByUrl('/outdoor');
    }

    //set timeout to allow all components to be loaded
   setTimeout( () => {
     //move to the hall buildin
     if (this.currentStep.floor.includes('h')) {
       if(this.currentStep.floor === 'h8'){
         this.router.navigateByUrl('/indoor/hall');
       } else {
         this.router.navigateByUrl('/indoor/hall');
         setTimeout(() => {
          this.changeFloor(this.currentStep.floor);
        }, 1000);
       }

     //move to jmsb
     } else {
       if(this.router.url !== '/indoor/jmsb'){
         this.router.navigateByUrl('/indoor/jmsb');
       }
     }
   }, 500)
  }

  //returns step before the first that wasn't done yet
  public getCurrentStep(){
    let i = 0;
    for (i = 0; i < this.steps.length; i++) {
      if (!this.steps[i].wasDone) {
        break;
      }
    }
    if(i !== 0){
      return this.steps[i-1];
    }
  }

  //if first step wasn't done, returns that steps haven't been initiated
  public stepsBeenInit() : boolean{
    return (this.steps[0]) ? this.steps[0].wasDone : false;
  }

  //set type of mixed directions
  //used in both inside and outside directions, when mixed
  public setMixedType(type){
    if(type === MixedDirectionsType.floorToBuilding || type === MixedDirectionsType.classToClass || type === MixedDirectionsType.buildingToFloor){
      this.mixedType = type;
    } else {
      throw new Error('Wrong type of Mixed Directions');
    }
  }

  //get type of mixed directions
  //used in both inside and outside directions, when mixed
  public getMixedType(){
    if(this.mixedType === MixedDirectionsType.floorToBuilding || this.mixedType === MixedDirectionsType.classToClass || this.mixedType === MixedDirectionsType.buildingToFloor ){
      return this.mixedType;
    } else {
      return null;
    }
  }

  //create path from current location to class room using destination classroom string
  public getPathToRoom(classroom: string){
    //remove all white space or symbols from classroom string
    let classroomFormatted = classroom.replace(/[\s|\W]*/g, '').toLocaleLowerCase();

    const coordinates = this.geolocationService.getCoordinates();
    if(coordinates){
      let toBuildingLat: number;
      let toBuildingLng: number;
      let toBuilding: any;
      let tempIndoorStep: any;
      if(classroomFormatted.includes('mb1')){
        toBuilding = 'jmsb';
        toBuildingLat = this.jmsbCoords.lat;
        toBuildingLng = this.jmsbCoords.lng;

        //indoor path to jmsb classroomFormatted
        tempIndoorStep = {
          floor: 'mb1',
          source: 'entrance',
          dest: 'mb1-210',
          wasDone: false,
          isLast: true
        }

      } else if(classroomFormatted.includes('h8') || classroomFormatted.includes('h9')){
        toBuilding = "hall";
        toBuildingLat = this.hallCoords.lat;
        toBuildingLng = this.hallCoords.lng;

        //indoor path to hall building classroomFormatted
        tempIndoorStep = {
          floor: (classroomFormatted.includes('h8')) ? 'h8' : 'h9',
          source: 'escalators-up',
          dest: classroomFormatted,
          wasDone: false,
          isLast: true
        }
      }
      //building of classroomFormatted
      const to = {
        building: toBuilding,
        lat: toBuildingLat,
        lng: toBuildingLng
      }
      //current position
      const from = {
        building: '',
        lat: coordinates.latitude,
        lng: coordinates.longitude
      }
      //outdoor step
      const tempOutdoorStep = {
        source: from,
        dest: to,
        wasDone: false,
        isLast: false
      }
      this.pushStep(tempOutdoorStep);
      this.pushStep(tempIndoorStep);
      this.mixedType = MixedDirectionsType.buildingToFloor;
      this.dataSharingService.updateMapSize(-210);
      this.initiatePathSteps();

    } else {
      throw new Error('Current location unavailable');
    }
  }
}
