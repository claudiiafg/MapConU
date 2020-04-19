import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  /**
   * SGW or Loyola Campus, default is set to SGW
   */
  private messageSrc = new BehaviorSubject<any>('msg');
  public mapSize = new BehaviorSubject(this.platform.height() - 106); // original map size
  /**
   * Current language of the app 'fr' or 'en'
   */
  public language = new BehaviorSubject<string>('lang');
  /**
   * Necessary parameters to display the indoor time of arrival stored as an array,
   * the start loaction (toaParams[0]), the destination location (tosParams[1]) and the time to get from start to
   * destination (toaParams[2])
   */
  public toaParams = new BehaviorSubject<any>(['start', 'dest', 0]);
  public showToa = new BehaviorSubject<boolean>(false);
  public showSideButtons = new BehaviorSubject<boolean>(true);
  public showPoi = new BehaviorSubject<any>(['poiToShow', false]);
  public hidePoi = new BehaviorSubject<any>(['poiToHide', false]);
  public setIndoorPoiToggles = new BehaviorSubject<boolean>(false);
  /**
   * Send poi status for bathroom, elevator, stairs, escalator, fireExit, entrance in that order
   */
  public toggleStatus = new BehaviorSubject<any>([false, false, false, false, false, false]);
  public currentBuilding = new BehaviorSubject<string>('building');
  currentMessage = this.messageSrc.asObservable();
  currentLanguage = this.language.asObservable();

  constructor(public platform: Platform) {
    this.mapSize = new BehaviorSubject(this.platform.height() - 106); // original map size
  }

  /**
   * Updates the current campus when it is changed from the OutdoorNavigationToolbarComponent so that subscribers
   * know the campus has changed
   * @param message can be either SGW or Loyola campus
   */
  updateMessage(message: any) {
    this.messageSrc.next(message);
  }

  public updateMapSize(size: number) {
    this.mapSize.next(this.platform.height() + size);
  }

  /**
   * Updates the app language when it is changed from the SettingsOptionsComponent so that subscribers with textual
   * components know when to update their translations
   * @param languageUpdate either 'en' for english or 'fr' for french
   */
  public updateAppLanguage(languageUpdate: string) {
    this.language.next(languageUpdate);
  }

  /**
   * When a new indor route is set, this method updates the indoor toa parameters so the modal with the time of arrival
   * can be created for that specifice path
   * @param toaParamsUpdate and array with start loaction (toaParams[0]), the destination location (tosParams[1])
   * and the time to get from start to destination (toaParams[2])
   */
  public updateIndoorToaParameters(toaParamsUpdate: any[3]){
    this.toaParams.next(toaParamsUpdate);
  }

  /**
   * When a new indoor path is requested, this method notifies that the time of arrival needs to be visible on the page
   * @param updateShow Boolean that is true if there is a toa that needs to be shown and false otherwise
   */
  public showIndoorToa(updateShow: boolean){
    this.showToa.next(updateShow);
  }

  /**
   * Notifies subscribers to show markers for a particular indoor poi
   * @param showPoi Array with string for poi to update [0] and boolean value of toggle [1]
   */
  public showIndoorPoi(showPoi: any[2]){
    this.showPoi.next(showPoi);
  }

  /**
   * Notifies subscribers to hide markers for a particular indoor poi
   * @param hidePoi Array with string for poi to update [0] and boolean value of toggle [1]
   */
  public hideIndoorPoi(hidePoi: any[2]){
    this.hidePoi.next(hidePoi);
  }

  /**
   * Notifies subscribers to update a poi toggle
   * @param update Boolean indicating whether to show or hide poi markers
   */
  public updateIndoorPoiToggles( update: boolean){
    this.setIndoorPoiToggles.next(update);
  }

  /**
   * Updates indoor pois toggle status
   * @param resp an Array of booleans indicating if the indoor pois are toggled on or off, booleans represent
   * bathroom, elevator, stairs, escalator, fireExit, entrance, in that order
   */
  public updateToggleResponse( resp: any[6]){
    this.toggleStatus.next(resp);
  }

  public updateCurrentBuilding ( updateBuilding: string){
    this.currentBuilding.next(updateBuilding);
  }
  public updateShowSideButtons ( showButtons: boolean){
    this.showSideButtons.next(showButtons);
    return showButtons;
  }
}
