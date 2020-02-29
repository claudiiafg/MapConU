import { Component } from '@angular/core';
import { IndoorDirectionsService, Line, Point } from 'src/services/indoorDirectionsService';
import { Events } from '@ionic/angular';


@Component({
  selector: 'mb1-floor-plan',
  templateUrl: 'mb1.html',
  styleUrls: ['./mb1.scss']
})
export class MB1FloorPlan {
  private pathLines: Line[] = [];
  private interestPoints: Point[] = [];
  private sourceID: string = 'entrance';
  private destID: string = 'out';
  private path: string[] = []; //path of line ids
  private foundPath: boolean = false;

  constructor(
    private indoorDirectionsService : IndoorDirectionsService,
    private events: Events,

  ){}

  ngOnInit(){
    let docElementLines = document.getElementsByTagName('line');
    let docInterestPoints = document.getElementsByTagName('circle');

    this.indoorDirectionsService.setMap(docElementLines, docInterestPoints);
    this.pathLines = this.indoorDirectionsService.getLines();
    this.interestPoints = this.indoorDirectionsService.getPoints();

    this.events.subscribe('path-found', () => {
      this.path = this.indoorDirectionsService.getPath();
      this.foundPath = true;
      for(let line of this.path){
        let docElement = document.getElementById(line);
        docElement.style.stroke = 'blue';
      }
    });
  }

  public setSource(pointName: string){
    try{
      this.indoorDirectionsService.setSource(pointName);
      this.sourceID = pointName;

    } catch (e){
      console.error(e);
    }
  }

  public setDest(pointName: string){
    try{
      this.indoorDirectionsService.setDest(pointName);
      this.destID = pointName;

    } catch (e){
      console.error(e);
    }
  }


}
