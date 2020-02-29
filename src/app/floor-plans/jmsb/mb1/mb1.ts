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

  _wasVisited: boolean,
  _isIntersection: boolean,
  _isLeaf: boolean
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
  private destID: string = 'out';
  private sourceLine: Line;
  private destLine: Line;
  private path: string[] = []; //path of line ids
  private foundPath: boolean = false;

  constructor(
  ){}

  ngOnInit(){
    let docElementLines = document.getElementsByTagName('line');
    let docInterestPoints = document.getElementsByTagName('circle');

    let tempPathLines: Line[] = [];
    let tempInterestPoints: Point[] = [];

    for(let i in docElementLines){
      // if(docElementLines[i].style){
      //   docElementLines[i].style.stroke = 'transparent';
      // }

      //set temporaty lines with right structure
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
          connectedLines: [],

          _wasVisited: false,
          _isIntersection: false,
          _isLeaf: false
        }
        tempPathLines.push(tempLine);
      }
    }

    //check for which lines are connected by a point
    for(let item of tempPathLines){
      let relatedLines = tempPathLines.filter(line => (line.id !== item.id) && this.sharePoint(line, item));
      if(relatedLines){
        for(let each of relatedLines){
          item.connectedLines.push(each.id);
        }
      }
    }
    this.pathLines = tempPathLines;

    //set points in right structure
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

    //check type of line
    for(let item of tempPathLines){
      if((this.hasPointConnected(item.id) && item.connectedLines.length > 1) || (!this.hasPointConnected(item.id) && item.connectedLines.length > 2)){
        item._isIntersection = true;
      }
      if(this.hasPointConnected(item.id)){
        item._isLeaf = true;
      }
    }
    this.pathLines = tempPathLines;
  }

  //get all data from a point by passing its id
  private getPointInfoById(id: string) : Point{
    return this.interestPoints.filter(point => point.id === id)[0];
  }

  //get line connected to a point
  private getInterestLineById(pointID : string) : Line{
    const point = this.getPointInfoById(pointID);
    if(point){
      let x = point.x;
      let y = point.y;
      let lines = this.pathLines.filter(line => (line.p1.x === x && line.p1.y === y) || (line.p2.x === x && line.p2.y === y));
      return lines[0];
    }
  }

  //get point connected to a line (return null if none)
  private getPointOfLineById(lineID: string) : Point{
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    let tempPoint = this.interestPoints.filter(point => {
      (point.x === tempLine.p1.x && point.y === tempLine.p1.y) ||
      (point.x === tempLine.p2.x && point.y === tempLine.p2.y)
    })[0];
    return tempPoint;
  }

  //check if line if connected to a point
  private hasPointConnected(lineID: string) : boolean{
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    let tempPoint = this.interestPoints.filter(point =>
      (point.x === tempLine.p1.x && point.y === tempLine.p1.y) ||
      (point.x === tempLine.p2.x && point.y === tempLine.p2.y)
    )[0];
    if(tempPoint){
      return true;
    } else {
      return false;
    }
  }

  //get line's information by passing its id
  getLineById(lineID: string) : Line {
    return this.pathLines.filter(line => line.id === lineID)[0];
  }

  //get all connections of a line by passing its id
  private getConnectedLineById(lineID : string) : string[]{
    return this.pathLines.filter(line => line.id === lineID)[0].connectedLines;
  }

  //check if 2 lines share a point
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

  //calculate length between lines
  private calcLength(x1, x2, y1, y2) : number{
    if(x1 === x2){
      return Math.max(y1, y2) - Math.min(y1, y2);
    } else{
      return Math.max(x1, x2) - Math.min(x1, x2);
    }
  }

  //set line as visited
  private setAsVisited(lineID : string){
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    if(tempLine){
      tempLine._wasVisited = true;
    }
  }

  //check if line has connected lines that weren't visited while computing path
  hasUnvisitedLine(line: Line): boolean{
    for(let each of line.connectedLines){
      if(!this.getLineById(each)._wasVisited){
        return true;
      }
    }
    return false;
  }

  //get next line to visit form current line's connections
  getNextUnvisitedLine(line: Line) : Line {
    for(let each of line.connectedLines){
      if(!this.getLineById(each)._wasVisited){
        return this.getLineById(each);
      }
    }
  }

  countUnvisitedLines(line:Line) : number {
    let i = 0;
    for(let each of line.connectedLines){
      if(!this.getLineById(each)._wasVisited){
        i += 1;
      }
    }
    return i;
  }

  //check if line if leaf (has a point connected to it)
  isLeaf(lineID : string) : boolean{
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    if(tempLine){
      return tempLine._isLeaf;
    }
  }

  //check if line if intersections (there's multiple possible paths to follow, not linear)
  isIntersection(lineID : string) : boolean{
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    if(tempLine){
      return tempLine._isIntersection;
    }
  }

  sharesLastLineWithPrevious(top : Line) : boolean{
    let previous = this.getLineById(this.path[this.path.length-1]);
    if(this.countUnvisitedLines(top) === 1){
      let nextLine = this.getNextUnvisitedLine(top)
      if(previous && previous.connectedLines.includes(nextLine.id)){
        return true;
      }
    }
    return false;
  }

  private logSomething(){
    this.sourceLine = this.getInterestLineById(this.sourceID);
    // this.sourceLine._wasVisited = true;
    this.destLine = this.getInterestLineById(this.destID);
    this.path.push(this.sourceLine.id);
    // console.log(this.pathLines);
    //
    // this.setAsVisited('line1');
    // this.setAsVisited('line2');
    // this.setAsVisited('line3');
    // this.setAsVisited('line4');
    // this.setAsVisited('line5');
    // this.setAsVisited('line6');
    // this.setAsVisited('line7');
    // this.setAsVisited('line8');
    // this.setAsVisited('line9');
    // this.setAsVisited('line10');
    // this.setAsVisited('line11');
    // this.setAsVisited('line12');
    //
    // // this.path = ['line1', 'line2', 'line3', 'line4'];
    // this.path = ['line1', 'line5', 'line10', 'line12', 'line13'];
    console.log(this.path);

    this.computePath();
  }



  computePath(){

    console.log('calling fn');
    let line = this.getLineById(this.path[this.path.length-1]);
    this.setAsVisited(line.id);
    console.log(line);

    if(this.foundPath){
      return;
    }

    //leaf line
    if(this.isLeaf(line.id) && (line.id !== this.sourceLine.id)){
      console.error('1 connected -> is leaf');

      // if line if equal to the line we're looking for
      if(line.id === this.destLine.id){
        console.log('FOUND ROOM');
        this.foundPath = true;
        console.log(this.path);
        return;

      //found leaf line but not the destination
      } else {
        console.error('found leaf line but not the destination');
        //mark as visited and pop the path's array until found intersection with a line not visited
        let top: Line;
        let i = 1;
        do {
          console.log('rolling back: ' + ++i);
          let arrayTop = this.path.pop();
          top = this.getLineById(arrayTop);
          console.log("top: " + top.id);
          console.log(this.path);
        } while (!(top._isIntersection && this.hasUnvisitedLine(top) && !(this.sharesLastLineWithPrevious(top))));

        console.error('outside rolling');
        //push top back in
        //push next line to visit
        //compute path from new line
        this.path.push(top.id);
        console.log(this.path);
        console.log(this.getNextUnvisitedLine(top).id);
        this.path.push(this.getNextUnvisitedLine(top).id);
        this.computePath();
        return;
      }

  //previous line and next line only
} else if (!this.isIntersection(line.id) && (!this.isLeaf(line.id) || line.id !== this.sourceLine.id)){
    console.error('2 connected -> prev and next');
    console.log(this.isIntersection(line.id));
    console.log(this.isLeaf(line.id));

      let tempLine : Line = line;
      let nextLine : string;

      do{
        console.error('rolling forward');
        nextLine = tempLine.connectedLines.filter(line => !this.getLineById(line)._wasVisited)[0];
        if(nextLine){
          console.log('theres next');
          console.log(nextLine);
          this.path.push(nextLine);
          tempLine = this.getLineById(nextLine);
        }

      } while (nextLine)

      console.error('outside rolling forward');
      console.log(this.path);
      this.computePath();
      return;

    //multiple lines (is intersectiong)
  } else if(this.isIntersection(line.id)){
      console.error('is intersections');
      console.error('get next');
      console.log(this.getNextUnvisitedLine(line));
      this.path.push(this.getNextUnvisitedLine(line).id);
      this.computePath();
      return;
    }

  }



























}
