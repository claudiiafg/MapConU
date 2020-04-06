import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Events } from '@ionic/angular';
import { DirectionsManagerService } from 'src/services/directionsManager.service';
import { IndoorDirectionsService } from 'src/services/indoorDirections.service';
import { DataSharingService} from '../../../services/data-sharing.service';

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
  private showToaComponent: boolean = false;
  private bathroom: boolean = false;
  private elevators: boolean = false;
  private stairs: boolean = false;
  private fireExtinguisher: boolean = false;
  private fireExit: boolean = false;
  private escalator: boolean = false;
  private entrance: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private events: Events,
    private router: Router,
    private directionManager: DirectionsManagerService,
    private indoorDirections: IndoorDirectionsService,
    private dataSharing: DataSharingService

  ) {}

  ngOnInit() {
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

    this.dataSharing.showPoi.subscribe( toggle =>{
      this.updateToggle(toggle[0], toggle[1]);
    });

    this.dataSharing.hidePoi.subscribe( toggle =>{
      this.updateToggle(toggle[0], toggle[1]);
    });

    this.dataSharing.setIndoorPoiToggles.subscribe(status =>{
      //send back toggle status when popover opens
      if(status) {
        this.dataSharing.updateToggleResponse([
          this.bathroom,
          this.elevators,
          this.stairs,
          this.escalator,
          this.fireExtinguisher,
          this.fireExit,
          this.entrance
        ]);
      }
    });
  }

  private subscribeToEvents() {
    this.events.subscribe('isSelectMode', res => {
      this.isSelectMode = res;
      this.directionManager.setSelectMode(this.isSelectMode);
    });

    //when floor changes -> change view
    this.events.subscribe('floor-changes', res => {
      if (res) {
        if(this.floor === parseInt(res)){
          this.events.publish('map-set', Date.now());

        } else {
          this.events.publish('initNewMap', Date.now());
          this.floor = parseInt(res);
        }
      }
    });

    this.events.subscribe('reset-indoor', () => {
      this.directionManager.resetSteps();
      this.indoorDirections.resetNav()
      this.building = null;
      this.floor = null;
    });

    this.dataSharing.showToa.subscribe( updateShow => {
      this.showToaComponent = updateShow;
    });
  }

  //important to reload route
  @HostListener('unloaded')
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  updateToggle(poi: string, condition: boolean){
    console.log('toggle update poi in indoor page is ', poi, ' condition is ', condition);
    if(poi.includes('wc')){
      this.bathroom = condition;
    }
    if(poi.includes('elevator')){
      this.elevators = condition;
    }
    if(poi.includes('stairs')){
      this.stairs = condition;
    }
    if(poi.includes('escalator')){
      this.escalator = condition;
    }
    if(poi.includes('fire-extinguisher')){
      this.fireExtinguisher = condition;
    }
    if(poi.includes('fire-exit')){
      this.fireExit = condition;
    }
    if(poi.includes('entrance')){
      this.entrance = condition;
    }
  }
}
