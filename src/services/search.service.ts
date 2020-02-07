import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  origin = new BehaviorSubject([]);
  destination = new BehaviorSubject([]);
  constructor() {}
}
