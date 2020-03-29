import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Buildinginfo } from "./buildinginfo";
import { Coordinates } from "./coordinates";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { SQLitePorter } from "@ionic-native/sqlite-porter/ngx";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";

@Injectable({
  providedIn: "root"
})
export class SqliteService {
  private storage: SQLiteObject;
  buildingList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter
  ) {
    this.platform.ready().then(() => {
      this.sqlite
        .create({
          name: "data.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.getData();
        });
    });
  }

  getData() {
    this.httpClient
      .get("../assets/dump.sql", { responseType: "text" })
      .subscribe(data => {
        this.sqlPorter
          .importSqlToDb(this.storage, data)
          .then(_ => {
            this.getBuildingsInfo();
            this.isDbReady.next(true);
          })
          .catch(error => console.error(error));
      });
  }

  getBuildingsInfo() {
    return this.storage
      .executeSql(
        "SELECT name, address, lat, lng " +
          "FROM buildinginfo, buildingcoordinates " +
          "WHERE buildinginfo.id = buildingcoordinates.build_id " +
          "ORDER BY buildinginfo.id",
        []
      )
      .then(res => {
        let tempName = "";
        let tempAddress = "";
        let tempCoordArr: Coordinates[] = [];
        let tempCoord: Coordinates = {lat: 0, lng: 0};
        let isDone = false;
        let items: Buildinginfo[] = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            tempName = res.rows.item(i).name;
            tempAddress = res.rows.item(i).address;
            tempCoord = {
              lat: res.rows.item(i).lat,
              lng: res.rows.item(i).lng
            }
            console.log(tempCoord);
            tempCoordArr.push(tempCoord);

            if(res.rows.item(i+1)) {
              if (tempName !== res.rows.item(i+1).name) {
                isDone = true;
              }

              if (isDone) {
                items.push({
                  name: res.rows.item(i).name,
                  address: res.rows.item(i).address,
                  coords: tempCoordArr
                });
                tempCoordArr = [];
                isDone = false;
              }
            } else {
              items.push({
                name: tempName,
                address: tempAddress,
                coords: tempCoordArr
              });
            }
          }
        }
        console.log(items);
        this.buildingList.next(items);
      });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchBuildings(): Observable<Buildinginfo[]> {
    return this.buildingList.asObservable();
  }
}
