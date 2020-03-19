import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringHelperService {
  constructor(
  ) {}

  public prettifyTitles(pointName : string) : string {
    let prettyName: string = '';

    if (pointName.includes('wc-female')) {
      prettyName = 'Female bathrooms';
    } else if (pointName.includes('wc-male')) {
      prettyName = 'Male bathrooms';
    } else if (pointName.includes('wc')) {
      prettyName = 'Bathrooms';
    } else if (pointName.includes('entrance')) {
      prettyName = 'Entrance';
    } else if (pointName.includes('down') && pointName.includes('stairs')) {
      prettyName = 'Stairs going down';
    } else if (pointName.includes('down') && pointName.includes('escalators')) {
      prettyName = 'Escalator going down';
    } else if (pointName.includes('up') && pointName.includes('escalators')) {
      prettyName = 'Escalator going up';
    } else if (pointName.includes('up') && pointName.includes('stairs')) {
      prettyName = 'Stairs going up';
    } else if (pointName.includes('down') && pointName.includes('stairs')) {
      prettyName = 'Stairs going down';
    } else if (pointName.includes('ne')) {
      prettyName = 'North East stairs';
    } else if (pointName.includes('nw')) {
      prettyName = 'North West stairs';
    } else if (pointName.includes('sw')) {
      prettyName = 'South West stairs';
    } else if (pointName.includes('se')) {
      prettyName = 'South East stairs';
    } else if (pointName === 'stairs') {
      prettyName = 'Stairs';
    } else if (pointName.includes('elevator')) {
      prettyName = 'Elevators';
    } else if (pointName.includes('out')) {
      prettyName = 'Exit';
    } else {
      prettyName = pointName;
    }

    return prettyName;
  }

}
