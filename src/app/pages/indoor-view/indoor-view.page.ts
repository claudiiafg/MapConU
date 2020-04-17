import { Component, OnInit, HostListener } from '@angular/core';
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
  }

  private subscribeToEvents() {
    this.events.subscribe('isSelectMode', res => {
      this.isSelectMode = res;
      this.directionManager.setSelectMode(this.isSelectMode);
    });

    //when floor changes -> change view
    //help trigger the change in floor to child components
    this.events.subscribe('floor-changes', res => {
      if (res) {
        if(this.floor === parseInt(res)){
          //if is the same floor trigger that map is set (aka has already been set, continue)
          this.events.publish('map-set', Date.now());

        } else {
          //if floor is different initiate a new map
          this.events.publish('initNewMap', Date.now());
          this.floor = parseInt(res);
        }
      }
    });

    //subscribed to indoor-toolbar
    //when goBackOutside is pressed, cancel all indoor directions
    this.events.subscribe('reset-indoor', () => {
      this.directionManager.resetSteps();
      this.indoorDirections.resetNav()
      this.building = null;
      this.floor = null;
    });

    /**
     * Subscribe to showToa from dataSharingService.ts so page knows when to display the time required to get to an
     * indoor location
     */
    this.dataSharing.showToa.subscribe( updateShow => {
      this.showToaComponent = updateShow;
    });

    /**
     * Subscribe to showPoi from dataSharingService.ts to get notified to display the markers for an indoor poi
     */
    this.dataSharing.showPoi.subscribe( toggle =>{
      this.updateToggle(toggle[0], toggle[1]);
    });

    /**
     * Subscribe to hidePoi from dataSharingService.ts to get notified to hide the markers for an indoor poi
     */
    this.dataSharing.hidePoi.subscribe( toggle =>{
      this.updateToggle(toggle[0], toggle[1]);
    });

    this.dataSharing.setIndoorPoiToggles.subscribe(status =>{
      /**
       * When indoor poi popover opens, end back history of which poi's were toggled when the popover was last opened
       * so that the appropriate locations will be toggled on an off at initialization.
       */
      if(status) {
        this.dataSharing.updateToggleResponse([
          this.bathroom,
          this.elevators,
          this.stairs,
          this.escalator,
          this.fireExit,
          this.entrance
        ]);
      }
    });
  }

  //important to reload route
  @HostListener('unloaded')
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  /**
   * Updates the toggle status of a poi when it is changed
   * @param poi The indoor point of interest that is to be updated
   * @param condition Boolean true when the poi is toggled on and false when the poi is toggled off
   */
  updateToggle(poi: string, condition: boolean){
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
    if(poi.includes('exit')){
      this.fireExit = condition;
    }
    if(poi.includes('entrance')){
      this.entrance = condition;
    }
  }
}
