import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';
import { DirectionsManagerService } from 'src/services/directionsManager.service';
import { DataSharingService} from "../../../services/data-sharing.service";

@Component({
  selector: 'app-indoor-view',
  templateUrl: './indoor-view.page.html',
  styleUrls: ['./indoor-view.page.scss']
})
export class IndoorViewPage implements OnInit {
  private sub;
  private building: string = 'hall';
  private floor: number = 1;
  private isSelectMode: boolean = false;
  private showToaComponent: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private events: Events,
    private directionManager: DirectionsManagerService,
    private dataSharing: DataSharingService
  ) {
    this.subscribeToEvents();
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.building = params['id'];
        if (this.building === 'hall') {
          this.floor = 8;
        }
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
      if (res) {
        this.floor = parseInt(res);
      }
    });
    this.subscribeToShowToa();
  }

  subscribeToShowToa(){
    this.dataSharing.showToa.subscribe( updateShow => {
      this.showToaComponent = updateShow;
    })
  }
}
