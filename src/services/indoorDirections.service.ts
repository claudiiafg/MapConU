import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

export interface Line {
  id: string;
  p1: {
    x: number;
    y: number;
  };
  p2: {
    x: number;
    y: number;
  };
  length: number;
  connectedLines: string[];

  _wasVisited: boolean;
  _isIntersection: boolean;
  _isLeaf: boolean;
}

export interface Point {
  id: string;
  x: number;
  y: number;
}

@Injectable()
export class IndoorDirectionsService {
  private pathLines: Line[] = [];
  private interestPoints: Point[] = [];
  private sourceID: string = 'entrance';
  private destID: string = 'out';
  private sourceLine: Line;
  private destLine: Line;
  private path: string[] = []; //path of line ids
  private foundPath: boolean = false;

  constructor(private events: Events) {}

  //**********************PUBLC HELPERS**********************

  public setMap(docElementLines, docInterestPoints) {
    let tempPathLines: Line[] = [];
    let tempInterestPoints: Point[] = [];

    for (let i in docElementLines) {
      if (docElementLines[i].style) {
        docElementLines[i].style.stroke = 'transparent';
      }

      //set temporaty lines with right structure
      if (docElementLines[i].x1) {
        let x1 = docElementLines[i].x1.baseVal.value;
        let y1 = docElementLines[i].y1.baseVal.value;
        let x2 = docElementLines[i].x2.baseVal.value;
        let y2 = docElementLines[i].y2.baseVal.value;

        let tempLine: Line = {
          id: docElementLines[i].id,
          p1: {
            x: x1,
            y: y1
          },
          p2: {
            x: x2,
            y: y2
          },
          length: this.calcLength(x1, x2, y1, y2),
          connectedLines: [],

          _wasVisited: false,
          _isIntersection: false,
          _isLeaf: false
        };
        tempPathLines.push(tempLine);
      }
    }

    //check for which lines are connected by a point
    for (let item of tempPathLines) {
      let relatedLines = tempPathLines.filter(
        line => line.id !== item.id && this.sharePoint(line, item)
      );
      if (relatedLines) {
        for (let each of relatedLines) {
          item.connectedLines.push(each.id);
        }
      }
    }
    this.pathLines = tempPathLines;

    //set points in right structure
    for (let i in docInterestPoints) {
      if (docInterestPoints[i].cx) {
        let tempPoint: Point = {
          id: docInterestPoints[i].id,
          x: docInterestPoints[i].cx.baseVal.value,
          y: docInterestPoints[i].cy.baseVal.value
        };
        tempInterestPoints.push(tempPoint);
      }
    }
    this.interestPoints = tempInterestPoints;

    //check type of line
    for (let item of tempPathLines) {
      if (
        (this.hasPointConnected(item.id) && item.connectedLines.length > 1) ||
        (!this.hasPointConnected(item.id) && item.connectedLines.length > 2)
      ) {
        item._isIntersection = true;
      }
      if (this.hasPointConnected(item.id)) {
        item._isLeaf = true;
      }
    }
    this.pathLines = tempPathLines;
    this.reset();
  }

  //reset all variables when initiating a new map
  private reset() {
    this.foundPath = false;
    this.path = [];
    this.sourceLine = null;
    this.destLine = null;
    this.sourceID = '';
    this.destID = '';
  }

  //public helper to make sure all necessary information is available to compute path
  public computePathHelper(source: string, destination: string) {
    if(source !== destination){
      try {
        this.setSource(source);
        this.setDest(destination);
        this.computePath();
      } catch (e) {
        console.error(e);
      }
    }
  }

  public resetNav() {
    this.path = [];
    this.foundPath = false;
    for (let line of this.pathLines) {
      line._wasVisited = false;
    }
  }

  public getLines(): Line[] {
    return this.pathLines;
  }
  public getPoints(): Point[] {
    return this.interestPoints;
  }

  public getPath(): string[] {
    return this.path;
  }

  public setSource(pointID: string) {
    if (this.getPointInfoById(pointID)) {
      this.sourceID = pointID;
      this.sourceLine = this.getInterestLineById(pointID);
      this.path = [];
      this.path.push(this.sourceLine.id);
    } else {
      throw new Error(pointID + ': Point does not exist');
    }
  }

  public setDest(pointID: string) {
    if (this.getPointInfoById(pointID)) {
      this.destID = pointID;
      this.destLine = this.getInterestLineById(pointID);
    } else {
      throw new Error(pointID + ': Point does not exist');
    }
  }

  //check if 2 lines share a point
  private sharePoint(line1: any, line2: any): boolean {
    if (
      JSON.stringify(line1.p1) === JSON.stringify(line2.p1) ||
      JSON.stringify(line1.p1) === JSON.stringify(line2.p2) ||
      JSON.stringify(line1.p2) === JSON.stringify(line2.p1) ||
      JSON.stringify(line1.p2) === JSON.stringify(line2.p2)
    ) {
      return true;
    } else {
      return false;
    }
  }

  //calculate length between lines
  private calcLength(x1, x2, y1, y2): number {
    if (x1 === x2) {
      return Math.max(y1, y2) - Math.min(y1, y2);
    } else {
      return Math.max(x1, x2) - Math.min(x1, x2);
    }
  }

  //**********************POINT HELPERS**********************
  //get all data from a point by passing its id
  private getPointInfoById(id: string): Point {
    return this.interestPoints.filter(point => point.id === id)[0];
  }

  //get point connected to a line (return null if none)
  private getPointOfLineById(lineID: string): Point {
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    let tempPoint = this.interestPoints.filter(point => {
      (point.x === tempLine.p1.x && point.y === tempLine.p1.y) ||
        (point.x === tempLine.p2.x && point.y === tempLine.p2.y);
    })[0];
    return tempPoint;
  }

  //**********************LINE HELPERS**********************
  //get line connected to a point
  private getInterestLineById(pointID: string): Line {
    const point = this.getPointInfoById(pointID);
    if (point) {
      let x = point.x;
      let y = point.y;
      let lines = this.pathLines.filter(
        line =>
          (line.p1.x === x && line.p1.y === y) ||
          (line.p2.x === x && line.p2.y === y)
      );
      return lines[0];
    }
  }

  //check if line if connected to a point
  private hasPointConnected(lineID: string): boolean {
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    let tempPoint = this.interestPoints.filter(
      point =>
        (point.x === tempLine.p1.x && point.y === tempLine.p1.y) ||
        (point.x === tempLine.p2.x && point.y === tempLine.p2.y)
    )[0];
    if (tempPoint) {
      return true;
    } else {
      return false;
    }
  }

  //get line's information by passing its id
  private getLineById(lineID: string): Line {
    return this.pathLines.filter(line => line.id === lineID)[0];
  }

  //get all connections of a line by passing its id
  private getConnectedLineById(lineID: string): string[] {
    return this.pathLines.filter(line => line.id === lineID)[0].connectedLines;
  }

  //set line as visited
  private setAsVisited(lineID: string) {
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    if (tempLine) {
      tempLine._wasVisited = true;
    }
  }

  //check if line has connected lines that weren't visited while computing path
  private hasUnvisitedLine(line: Line): boolean {
    for (let each of line.connectedLines) {
      if (!this.getLineById(each)._wasVisited) {
        return true;
      }
    }
    return false;
  }

  //get next line to visit form current line's connections
  private getNextUnvisitedLine(line: Line): Line {
    for (let each of line.connectedLines) {
      if (!this.getLineById(each)._wasVisited) {
        return this.getLineById(each);
      }
    }
  }

  //count how many unvisited lines form connections
  private countUnvisitedLines(line: Line): number {
    let i = 0;
    for (let each of line.connectedLines) {
      if (!this.getLineById(each)._wasVisited) {
        i += 1;
      }
    }
    return i;
  }

  //check if line if leaf (has a point connected to it)
  private isLeaf(lineID: string): boolean {
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    if (tempLine) {
      return tempLine._isLeaf;
    }
  }

  //check if line if intersections (there's multiple possible paths to follow, not linear)
  private isIntersection(lineID: string): boolean {
    let tempLine = this.pathLines.filter(line => line.id === lineID)[0];
    if (tempLine) {
      return tempLine._isIntersection;
    }
  }

  //if one left line to visit and previous line also has that line as connection, visit it form previous line
  private sharesLastLineWithPrevious(top: Line): boolean {
    let previous = this.getLineById(this.path[this.path.length - 1]);
    if (this.countUnvisitedLines(top) === 1) {
      let nextLine = this.getNextUnvisitedLine(top);
      if (previous && previous.connectedLines.includes(nextLine.id)) {
        return true;
      }
    }
    return false;
  }

  //********************** MAIN ALGORITHM **********************
  private computePath() {
    //find last line in path and set it as visited
    let line = this.getLineById(this.path[this.path.length - 1]);
    this.setAsVisited(line.id);

    //line if leaf -> aka if connected to a interest point
    if (this.isLeaf(line.id) && line.id !== this.sourceLine.id) {

      //line is equal to the line we're looking for
      if (line.id === this.destLine.id) {
        console.log('FOUND ROOM');
        this.foundPath = true;
        this.events.publish('path-found', true, Date.now());
        return;

      //found leaf line but not the destination -> must ROLL BACK
      } else {
        //mark as visited and pop the path's array until found intersection with a line not visited
        let top: Line;
        do {
          let arrayTop = this.path.pop();
          top = this.getLineById(arrayTop);
        } while (
          !(
            top._isIntersection &&
            this.hasUnvisitedLine(top) &&
            !this.sharesLastLineWithPrevious(top)
          )
        );

        //push top back in
        //push next line to visit
        //compute path from new line
        this.path.push(top.id);
        this.path.push(this.getNextUnvisitedLine(top).id);
        this.computePath();
        return;
      }

    //connected lines are previous and next (no intersection) -> ROLL FORWARD
    } else if (
      !this.isIntersection(line.id) &&
      (!this.isLeaf(line.id) || line.id !== this.sourceLine.id)
    ) {

      let tempLine: Line = line;
      let nextLine: string;

      do {
        nextLine = tempLine.connectedLines.filter(
          line => !this.getLineById(line)._wasVisited
        )[0];
        if (nextLine) {
          this.setAsVisited(nextLine);
          this.path.push(nextLine);
          tempLine = this.getLineById(nextLine);
        }
      } while (nextLine);

      this.computePath();
      return;

    //first line has an initial straight path -> ROLL FORWARD
    } else if(line.id === this.sourceLine.id && line.id !== this.destLine.id && this.hasUnvisitedLine(line) && !this.isIntersection(line.id)) {

      let tempLine: Line = line;
      let nextLine: string;

      do{
        nextLine = tempLine.connectedLines.filter(line => !this.getLineById(line)._wasVisited)[0];
        if(nextLine){
          this.setAsVisited(nextLine);
          this.path.push(nextLine);
          tempLine = this.getLineById(nextLine);
        } else {
          break;
        }
      } while(nextLine && !(this.isLeaf(nextLine) && (nextLine !== this.destLine.id)))

      this.computePath();
      return;

    //multiple lines connected to it (is intersection)
    } else if (this.isIntersection(line.id)) {
      this.path.push(this.getNextUnvisitedLine(line).id);
      this.computePath();
      return;
    }
  }
}
