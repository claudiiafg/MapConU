import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  public origin = new BehaviorSubject([]);
  public destination = new BehaviorSubject([]);
  public isDirectionSet = new BehaviorSubject(false);

  constructor() {}
}
