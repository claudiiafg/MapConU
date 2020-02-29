import { Component } from '@angular/core';

export interface Line {
  id: string,
  p1: {
    x: number,
    y: number,
  },
  p2: {
    x: number,
    y: number,
  },
  length: number,
  connectedLines: string[],

  _wasVisited?: boolean
}

export interface Point {
  id: string,
  x: number,
  y: number
}

@Component({
  selector: 'mb1-floor-plan',
  templateUrl: 'mb1.html',
  styleUrls: ['./mb1.scss']
})
export class MB1FloorPlan {
  private pathLines: Line[] = [];
  private interestPoints: Point[] = [];
  private sourceID: string = 'entrance';
  private destID: string = 'mb1-210';
  private path: Line[] = [];

  constructor(
  ){}

  ngOnInit(){
    let docElementLines = document.getElementsByTagName('line');
    let docInterestPoints = document.getElementsByTagName('circle');

    let tempPathLines: any[] = [];
    let tempInterestPoints: any[] = [];

    for(let i in docElementLines){
      // if(docElementLines[i].style){
      //   docElementLines[i].style.stroke = 'transparent';
      // }
      if(docElementLines[i].x1){
        let x1 = docElementLines[i].x1.baseVal.value;
        let y1 = docElementLines[i].y1.baseVal.value;
        let x2 = docElementLines[i].x2.baseVal.value;
        let y2 = docElementLines[i].y2.baseVal.value;

        let tempLine : Line = {
          id: docElementLines[i].id,
          p1: {
            x: x1,
            y: y1,
          },
          p2: {
            x: x2,
            y: y2,
          },
          length: this.calcLength(x1, x2, y1, y2),
          connectedLines: []
        }
        tempPathLines.push(tempLine);
      }
    }
    for(let item of tempPathLines){
      let relatedLines = tempPathLines.filter(line => (line.id !== item.id) && this.sharePoint(line, item));
      if(relatedLines){
        for(let each of relatedLines){
          item.connectedLines.push(each.id);
        }
      }
    }
    this.pathLines = tempPathLines;

    for(let i in docInterestPoints){
      if(docInterestPoints[i].cx){
        let tempPoint : Point = {
          id: docInterestPoints[i].id,
          x: docInterestPoints[i].cx.baseVal.value,
          y: docInterestPoints[i].cy.baseVal.value
        }
        tempInterestPoints.push(tempPoint);
      }
    }
    this.interestPoints = tempInterestPoints;
    const pointID = this.sourceID;
    const sourceLine = this.getInterestLineById(pointID);
    this.path.push(sourceLine);
    // console.log(this.pathLines);
    // console.log(this.interestPoints);
  }

  private getPointInfoById(id: string) : Point{
    return this.interestPoints.filter(point => point.id === id)[0];
  }

  private getInterestLineById(pointID : string) : Line{
    const point = this.getPointInfoById(pointID);
    if(point){
      let x = point.x;
      let y = point.y;
      let lines = this.pathLines.filter(line => (line.p1.x === x && line.p1.y === y) || (line.p2.x === x && line.p2.y === y));
      return lines[0];
    }
  }

  getLineById(lineID: string) : Line {
    return this.pathLines.filter(line => line.id === lineID)[0];
  }

  private getConnectedLineById(lineID : string) : string[]{
    return this.pathLines.filter(line => line.id === lineID)[0].connectedLines;
  }

  private sharePoint(line1 : any, line2 : any) : boolean{
    if( JSON.stringify(line1.p1) === JSON.stringify(line2.p1) ||
        JSON.stringify(line1.p1) === JSON.stringify(line2.p2) ||
        JSON.stringify(line1.p2) === JSON.stringify(line2.p1) ||
        JSON.stringify(line1.p2) === JSON.stringify(line2.p2)) {
      return true;
    } else{
      return false;
    }
  }

  private calcLength(x1, x2, y1, y2) : number{
    if(x1 === x2){
      return Math.max(y1, y2) - Math.min(y1, y2);
    } else{
      return Math.max(x1, x2) - Math.min(x1, x2);
    }
  }

  private logSomething(){
  }






      






















}
