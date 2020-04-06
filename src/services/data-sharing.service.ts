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
  public showPoi = new BehaviorSubject<any>(['poiToShow', false]);
  public hidePoi = new BehaviorSubject<any>(['poiToHide', false]);
  public setIndoorPoiToggles = new BehaviorSubject<boolean>(false);
  //send poi status for bathroom, elevator, stairs, escalator, fireExtinguisher, fireExit, entrance in that order
  public toggleStatus = new BehaviorSubject<any>([false, false, false, false, false, false, false]);
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

  //sends an array with string for poi to update [0] and boolean value of toggle [1]
  public showIndoorPoi(showPoi: any[2]){
    this.showPoi.next(showPoi);
  }

  //sends an array with string for poi to update [0] and boolean value of toggle [1]
  public hideIndoorPoi(hidePoi: any[2]){
    this.hidePoi.next(hidePoi);
  }

  public updateIndoorPoiToggles( update: boolean){
    this.setIndoorPoiToggles.next(update);
  }

  public updateToggleResponse( resp: any[7]){
    this.toggleStatus.next(resp);
  }

  public updateCurrentBuilding ( updateBuilding: string){
    this.currentBuilding.next(updateBuilding);
  }
}
