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
  public toaParams = new BehaviorSubject<any>(['start', 'dest', 0]);
  public showToa = new BehaviorSubject<boolean>(false);
  public showPoi = new BehaviorSubject<string>('poiToShow');
  public hidePoi = new BehaviorSubject<string>('poiToHide');
  public setIndoorPoiToggles = new BehaviorSubject<boolean>(false);
  public currentBuilding = new BehaviorSubject<string>('building');
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

  public updateAppLanguage(languageUpdate: string) {
    this.language.next(languageUpdate);
  }

  public updateIndoorToaParameters(toaParamsUpdate: any[3]){
    this.toaParams.next(toaParamsUpdate);
  }

  public showIndoorToa(updateShow: boolean){
    this.showToa.next(updateShow);
  }

  public showIndoorPoi(showPoi: string){
    this.showPoi.next(showPoi);
  }

  public hideIndoorPoi(hidePoi: string){
    this.hidePoi.next(hidePoi);
  }

  public updateIndoorPoiToggles( update: boolean){
    this.setIndoorPoiToggles.next(update);
  }

  public updateCurrentBuilding ( updateBuilding: string){
    this.currentBuilding.next(updateBuilding);
  }
}
