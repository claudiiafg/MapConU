import { Component, OnInit } from '@angular/core';
import { DataSharingService} from '../../../../services/data-sharing.service';
import { StringHelperService} from '../../../../services/stringHelper.service';

@Component({
  selector: 'app-indoor-time-of-arrival',
  templateUrl: './indoor-time-of-arrival.component.html',
  styleUrls: ['./indoor-time-of-arrival.component.scss'],
})
export class IndoorTimeOfArrivalComponent implements OnInit {
  startPoint: string;
  destPoint: string;
  travelTime: number;

  constructor(
      private dataSharing: DataSharingService,
      private stringHelper: StringHelperService
  ) { }

  async ngOnInit() {
    this.subscribeToToaParams()
  }

  subscribeToToaParams(){
    this.dataSharing.toaParams.subscribe( toaParamsUpdate => {
      this.startPoint = this.stringHelper.prettifyTitles(toaParamsUpdate[0]);
      this.destPoint = this.stringHelper.prettifyTitles(toaParamsUpdate[1]);
      this.travelTime = toaParamsUpdate[2];
    })
  }

}
