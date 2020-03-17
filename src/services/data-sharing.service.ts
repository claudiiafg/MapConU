import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private messageSrc = new BehaviorSubject<any>('msg');
  public mapSize = new BehaviorSubject(this.platform.height() - 106); // original map size
  public language = new BehaviorSubject<string>('lang'); //current language of the app ['fr', 'en']
  currentMessage = this.messageSrc.asObservable();
  currentLanguage = this.language.asObservable();

  constructor(public platform: Platform) {
    this.mapSize = new BehaviorSubject(this.platform.height() - 106); // original map size
  }

  updateMessage(message: any) {
    this.messageSrc.next(message);
  }

  public updateMapSize(size: number) {
    this.mapSize.next(this.platform.height() + size);
  }

  public updateAppLanguage(languageUpdate: string){
    this.language.next(languageUpdate);
  }
}
