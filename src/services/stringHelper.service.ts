import { Injectable } from '@angular/core';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class StringHelperService {
  constructor(private translate: TranslationService) {}

  public prettifyTitles(pointName: string): string {
    let prettyName: string = '';

    if (pointName.includes('wc-female')) {
      prettyName = this.translate.getTranslation('bathroom-w');
    } else if (pointName.includes('wc-male')) {
      prettyName = this.translate.getTranslation('bathroom-m');
    } else if (pointName.includes('wc')) {
      prettyName = this.translate.getTranslation('bathroom');
    } else if (pointName.includes('entrance')) {
      prettyName = this.translate.getTranslation('entrance');
    } else if (pointName.includes('down') && pointName.includes('stairs')) {
      prettyName = this.translate.getTranslation('stairs-down');
    } else if (pointName.includes('down') && pointName.includes('escalator')) {
      prettyName = this.translate.getTranslation('escalator-down');
    } else if (pointName.includes('up') && pointName.includes('escalator')) {
      prettyName = this.translate.getTranslation('escalators');
    } else if (pointName.includes('up') && pointName.includes('stairs')) {
      prettyName = this.translate.getTranslation('stairs');
    } else if (pointName.includes('ne')) {
      prettyName = this.translate.getTranslation('stairs-ne');
    } else if (pointName.includes('nw')) {
      prettyName = this.translate.getTranslation('stairs-nw');
    } else if (pointName.includes('sw')) {
      prettyName = this.translate.getTranslation('stairs-sw');
    } else if (pointName.includes('se')) {
      prettyName = this.translate.getTranslation('stairs-se');
    } else if (pointName === 'stairs') {
      prettyName = this.translate.getTranslation('stairs');
    } else if (pointName.includes('elevator')) {
      prettyName = this.translate.getTranslation('elevators');
    } else if (pointName.includes('out')) {
      prettyName = this.translate.getTranslation('exit');
    } else if (pointName.includes('study-hall')) {
      prettyName = this.translate.getTranslation('studyHall');
    } else {
      prettyName = pointName;
    }

    return prettyName;
  }
}
