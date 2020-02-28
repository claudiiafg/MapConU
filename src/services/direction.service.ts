import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  public origin = new BehaviorSubject([]);
  public destination = new BehaviorSubject([]);
  public isDirectionSet = new BehaviorSubject(false);
  public changeTravelMode = new BehaviorSubject('walk');
  public directionInfo = new BehaviorSubject<any>({});
  private directionSteps: any;

  constructor() {}

  public setDirectionsSteps(steps: any) {
    let stepsWithIcons = this.setStepsIcons(steps);
    this.directionSteps = stepsWithIcons;
  }

  public getDirectionsSteps() {
    return this.directionSteps;
  }

  public setStepsIcons(steps: any) {
    let stepsWithIcons = steps;
    let counter = 1;
    for (var key in stepsWithIcons) {
      // Travel icons
      if (stepsWithIcons[key].travel_mode === 'WALKING') {
        stepsWithIcons[key].travel_icon = 'walk';
      } else if (stepsWithIcons[key].travel_mode === 'TRANSIT') {
        stepsWithIcons[key].travel_icon = 'train';
      } else {
        stepsWithIcons[key].travel_icon = 'car';
      }

      // Maneuver icons
      if (stepsWithIcons[key].maneuver.includes('left')) {
        stepsWithIcons[key].maneuver_icon = 'arrow-round-back';
      }
      if (stepsWithIcons[key].maneuver.includes('right')) {
        stepsWithIcons[key].maneuver_icon = 'arrow-round-forward';
      }
      if (stepsWithIcons[key].maneuver.includes('merge')) {
        stepsWithIcons[key].maneuver_icon = 'git-merge';
      }

      stepsWithIcons[key].position = counter;
      counter++;
    }

    return stepsWithIcons;
  }
}
