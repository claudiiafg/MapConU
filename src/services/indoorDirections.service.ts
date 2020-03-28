import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { DataSharingService} from './data-sharing.service';

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

@Injectable({
  providedIn: 'root'
})
export class IndoorDirectionsService {
  private pathLines: Line[] = [];
  private interestPoints: Point[] = [];
  private sourceID: string = 'entrance';
  private destID: string = 'out';
  private sourceLine: Line;
  private destLine: Line;
  private path: string[] = []; //path of line ids
  private foundPath: boolean = false;
  private pathLength: number = 0;
  private pathTime: number = 0;

  constructor(
      private events: Events,
      private dataSharing: DataSharingService
  ) {}

  //**********************PUBLC HELPERS**********************

  public setMap(docElementLines, docInterestPoints) {
    this.reset();
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
    for (let each of this.pathLines) {
      each._wasVisited = false;
    }
  }

  //public helper to make sure all necessary information is available to compute path
  public computePathHelper(source: string, destination: string) {
    if (source !== destination) {
      try {
        this.reset();
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

  public getPathLength(): number {
    if (this.foundPath) {
      return this.pathLength;
    } else {
      throw new Error('No found path to calculate length on');
    }
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

  private getUnvisitedLines(line: Line): string[] {
    let unvisited = [];
    for (let each of line.connectedLines) {
      if (!this.getLineById(each)._wasVisited) {
        unvisited.push(each);
      }
    }
    return unvisited;
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

  //if current line's 'lines to visit' are also in previous line as connection, visit it from previous line
  private sharesLastLineWithPrevious(top: Line): boolean {
    let previous = this.getLineById(this.path[this.path.length - 1]);
    let nextLine = this.getNextUnvisitedLine(top);
    if (previous && previous.connectedLines.includes(nextLine.id)) {
      return true;
    }
    return false;
  }

  private rollPathBack() {
    //mark as visited and pop the path's array until found intersection with a line not visited
    let top: Line;
    do {
      let arrayTop = this.path.pop();
      top = this.getLineById(arrayTop);
    } while (
      this.path.length !== 0 &&
      !(
        top._isIntersection &&
        this.hasUnvisitedLine(top) &&
        !this.sharesLastLineWithPrevious(top)
      )
    );
    //push top back in
    //push next line to visit
    //compute path from new line
    if (top) {
      this.path.push(top.id);
      this.path.push(this.getNextUnvisitedLine(top).id);
      this.computePath();
    }
  }

  //while there's a next line that hasn't been visited, keep pushing it
  private rollPathForward(line: Line) {
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
  }

  //roll first line until leaf or destination line
  private rollFirstLineForward(line: Line) {
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
      } else {
        break;
      }
    } while (
      nextLine &&
      !(this.isLeaf(nextLine) && nextLine !== this.destLine.id)
    );

    this.computePath();
  }

  //calculate the length of the path found
  private calculateLength() {
    let totalLength: number = 0;
    for (let lineID of this.path) {
      let line = this.getLineById(lineID);
      totalLength += line.length;
    }
    this.pathLength = totalLength;
  }

  //after path is found look for shortest path within it
  private getShortestWithin() {
    console.log('FOUND ROOM');
    this.foundPath = true;
    let tempPath = [];
    let i = 0;
    do {
      //push index and get line it
      tempPath.push(this.path[i]);
      let line = this.getLineById(this.path[i]);

      //look for lines in original path connected to current line that are not the next line but are ahead of it
      let linesInPath = line.connectedLines.filter(
        l => this.path.includes(l) && this.path.indexOf(l) > i
      );
      if (linesInPath) {
        let notNextLine = linesInPath.filter(
          li => this.path.indexOf(li) !== i + 1
        )[0];
        let newIndex = this.path.indexOf(notNextLine);

        //if found increase index to that line -1, since index will be increased at the end
        if (newIndex !== -1) {
          i = newIndex - 1;
        }
      }
      //increase line by default so next line in path is analyzed next
      i++;
    } while (i < this.path.length);

    //shortest path, whithin orinal path:
    this.path = tempPath;
    this.events.publish('path-found', true, Date.now());
    this.calculateLength();
  }

  setArrivalTime(){
    /*found that the average human walk speed is 1.35m/s and the and the distance between 2 adjacent classrooms is
    *approximately 7m at pathlength = 40, so for pathlength = 1 we have 0.175m.
     */
    this.pathTime = ((this.pathLength * 0.175) * 1.35)/60;
    this.pathTime = (Math.round((this.pathTime*10))/10);
    this.dataSharing.updateIndoorToaParameters([this.sourceID, this.destID, this.pathTime]);
    this.dataSharing.showIndoorToa(true);
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
        this.getShortestWithin();

        //found leaf line but not the destination -> must ROLL BACK
      } else {
        this.rollPathBack();
      }

      //connected lines are previous and next (no intersection) -> ROLL FORWARD
    } else if (
      !this.isIntersection(line.id) &&
      (!this.isLeaf(line.id) || line.id !== this.sourceLine.id)
    ) {
      this.rollPathForward(line);

      //first line has an initial straight path -> ROLL FORWARD
    } else if (
      line.id === this.sourceLine.id &&
      line.id !== this.destLine.id &&
      this.hasUnvisitedLine(line) &&
      !this.isIntersection(line.id)
    ) {
      this.rollFirstLineForward(line);

      //multiple lines connected to it (is intersection) WITH unvisited lines
    } else if (this.isIntersection(line.id) && this.hasUnvisitedLine(line)) {
      this.path.push(this.getNextUnvisitedLine(line).id);
      this.computePath();
      return;

      //multiple lines connected to it (is intersection) WITHOUT unvisited lines
    } else if (this.isIntersection(line.id) && !this.hasUnvisitedLine(line)) {
      this.rollPathBack();
    }
    //notify indoor-time-of-arrival component of path and time required to get there
    this.setArrivalTime();
  }
}
