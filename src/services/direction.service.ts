import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataSharingService } from './data-sharing.service';
import { Direction } from 'src/models/directionModel';

@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  public origin = new BehaviorSubject([]);
  public destination = new BehaviorSubject([]);
  public isDirectionSet = new BehaviorSubject(false);
  public changeTravelMode = new BehaviorSubject('WALKING');
  public directionInfo = new BehaviorSubject<any>({});
  public alternateDirection: any;
  public alternateDirectionSet: boolean = false;
  private mainInfoWindow: any;
  private alternateInfoWindow: any;
  private directionSteps: any;

  constructor(public dataSharingService: DataSharingService) {}

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
      if (stepsWithIcons[key].maneuver.includes('straight')) {
        stepsWithIcons[key].maneuver_icon = 'arrow-up';
      }

      stepsWithIcons[key].position = counter;
      counter++;
    }

    return stepsWithIcons;
  }

  public addInfoWindow(infoWindow: any, type: string) {
    if (type === 'Main') {
      this.mainInfoWindow = infoWindow;
    }
    if (type === 'Alternative') {
      this.alternateInfoWindow = infoWindow;
    }
  }

  public closeInfoWindows() {
    this.closeMainWindow();
    this.closeAlternateWindow();
  }

  public closeMainWindow() {
    if (this.mainInfoWindow) {
      this.mainInfoWindow.close();
    }
  }

  public closeAlternateWindow() {
    if (this.alternateInfoWindow) {
      this.alternateInfoWindow.close();
    }
  }

  /**
   * Function to set outside route with direction.
   * @param Direction Direction has source and origin, which are both coordinates.
   */
  public outputDirectionOnMap(direction: Direction, mapSize: number) {
    // set alternate direction to false if present
    if (this.alternateDirectionSet) {
      this.alternateDirection.set('directions', null);
      this.alternateDirectionSet = false;
    }

    this.isDirectionSet.next(true);
    this.dataSharingService.updateMapSize(mapSize);

    this.origin.next([direction.origin.lat, direction.origin.lng]);

    this.destination.next([
      direction.destination.lat,
      direction.destination.lng,
    ]);
  }
}
