import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private messageSrc = new BehaviorSubject<any>('msg');
  currentMessage = this.messageSrc.asObservable();

  constructor() {}

  updateMessage(message: any) {
    this.messageSrc.next(message);
  }
}
