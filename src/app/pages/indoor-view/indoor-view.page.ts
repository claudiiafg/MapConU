import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Events } from '@ionic/angular';
import { DirectionsManagerService } from 'src/services/directionsManager.service';

@Component({
  selector: 'app-indoor-view',
  templateUrl: './indoor-view.page.html',
  styleUrls: ['./indoor-view.page.scss']
})
export class IndoorViewPage implements OnInit {
  private sub;
  private building: string;
  private floor: number = 1;
  private isSelectMode: boolean = false;
  private mySubscription: any;

  constructor(
    private route: ActivatedRoute,
    private events: Events,
    private router: Router,
    private directionManager: DirectionsManagerService

  ) {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.building = params['id'];
        this.subscribeToEvents();
        if (this.building === 'hall') {
          if(this.directionManager.isMixedInRoute.getValue() === true){
            this.floor = this.directionManager.getHallFloor();
          } else {
            this.floor = 8;
          }
        }
      }
    });
    //important to reload current route
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {}

  private subscribeToEvents() {
    this.events.subscribe('isSelectMode', res => {
      this.isSelectMode = res;
      this.directionManager.setSelectMode(this.isSelectMode);
    });

    //when floor changes -> change view
    this.events.subscribe('floor-changes', res => {
      this.building = this.router.url.substring(this.router.url.lastIndexOf('/') + 1, this.router.url.length);
      if (res) {
        if(this.floor ===  parseInt(res)){
          this.events.publish('map-set', Date.now());

        } else {
          this.floor = parseInt(res);
        }
      }
    });
  }


  //important to reload route
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
