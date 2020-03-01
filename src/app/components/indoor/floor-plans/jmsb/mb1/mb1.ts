import { Component } from "@angular/core";
import {
  IndoorDirectionsService,
  Line,
  Point
} from "src/services/indoorDirectionsService";
import { Events, AlertController } from "@ionic/angular";

@Component({
  selector: "mb1-floor-plan",
  templateUrl: "mb1.html",
  styleUrls: ["./mb1.scss"]
})
export class MB1FloorPlan {
  private pathLines: Line[] = [];
  private interestPoints: Point[] = [];
  private sourceID: string = "entrance";
  private destID: string = "out";
  private path: string[] = []; //path of line ids
  private foundPath: boolean = false;
  private marker: any;

  constructor(
    private indoorDirectionsService: IndoorDirectionsService,
    private events: Events,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    let docElementLines = document.getElementsByTagName("line");
    let docInterestPoints = document.getElementsByTagName("circle");
    this.marker = document.getElementById("marker");
    this.marker.style.visibility = "hidden";

    this.indoorDirectionsService.setMap(docElementLines, docInterestPoints);
    this.pathLines = this.indoorDirectionsService.getLines();
    this.interestPoints = this.indoorDirectionsService.getPoints();

    document.addEventListener("click", (res: any) => {
      let ele: string = res.toElement.id;
      if (
        ele.includes("wc") ||
        ele.includes("mb1") ||
        ele.includes("down") ||
        ele.includes("up") ||
        ele.includes("elevator") ||
        ele.includes("out")
      ) {
        this.resetNav();
        this.initNav(ele);
      }
    });

    this.events.subscribe("path-found", () => {
      this.path = this.indoorDirectionsService.getPath();
      this.foundPath = true;
      for (let line of this.path) {
        let docElement = document.getElementById(line);
        docElement.style.stroke = "blue";
      }
    });

    this.events.subscribe("init-new-path", (data) => {
      if(data){
        this.resetNav();
        this.sourceID = data.source;
        this.destID = data.destination;
        let p = this.interestPoints.filter(point => point.id === this.destID)[0];
        this.setMarker(p);
        this.indoorDirectionsService.computePathHelper(
          this.sourceID,
          this.destID
        );
      }
    });
  }

  public initNav(name: string) {
    let point: Point;

    if (name.includes("mb")) {
      point = this.interestPoints.filter(point => point.id === name)[0];
    } else if (name.includes("elevator")) {
      point = this.interestPoints.filter(point => point.id === "elevator")[0];
    } else if (name.includes("wc")) {
      point = this.interestPoints.filter(point => point.id === "wc")[0];
    } else if (name.includes("up")) {
      point = this.interestPoints.filter(point => point.id === "stairs-up")[0];
    } else if (name.includes("down")) {
      point = this.interestPoints.filter(
        point => point.id === "escalators-down"
      )[0];
    } else if (name.includes("out")) {
      point = this.interestPoints.filter(point => point.id === "out")[0];
    }
    this.destID = point.id;
    this.setMarker(point);
    this.showPopover();
  }

  setMarker(point: Point) {
    this.marker.setAttribute("x", point.x - 26);
    this.marker.setAttribute("y", point.y - 26);
    this.marker.style.visibility = "visible";
  }

  public resetNav() {
    for (let line of this.path) {
      let docElement = document.getElementById(line);
      docElement.style.stroke = "transparent";
    }
    this.foundPath = false;
    this.indoorDirectionsService.resetNav();
  }

  async showPopover() {
    const alert = await this.alertController.create({
      header: "Where do you wish to know directions from?",
      cssClass: "alert-css",
      buttons: [
        {
          text: "From entrance",
          role: "entrance"
        },
        {
          text: "Choose source",
          role: "choose"
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    if (result.role === "entrance") {
      this.sourceID = "entrance";
      this.indoorDirectionsService.computePathHelper(
        this.sourceID,
        this.destID
      );
    } else if (result.role === "choose") {
      const data = {
        destination: this.destID,
        points: this.interestPoints
      };
      this.events.publish("manually-enter-destination", data, Date.now());
    }
  }

  public setSource(pointName: string) {
    try {
      this.indoorDirectionsService.setSource(pointName);
      this.sourceID = pointName;
    } catch (e) {
      console.error(e);
    }
  }

  public setDest(pointName: string) {
    try {
      this.indoorDirectionsService.setDest(pointName);
      this.destID = pointName;
    } catch (e) {
      console.error(e);
    }
  }
}
