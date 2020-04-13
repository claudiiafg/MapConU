import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OutdoorNavigationToolbarComponent } from '../../components/outdoor/outdoor-navigation-toolbar/outdoor-navigation-toolbar.component';
import { DataSharingService } from '../../../services/data-sharing.service';
@Component({
  selector: 'app-outdoor-view',
  templateUrl: './outdoor-view.page.html',
  styleUrls: ['./outdoor-view.page.scss']
})
export class OutdoorViewPage implements OnInit {
  @ViewChild('toolbar', { static: false })
  toolbar: OutdoorNavigationToolbarComponent;

  showSideButtons:Boolean = true;
  constructor(private router: Router, private dataSharingService: DataSharingService) {

  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.dataSharingService.showSideButtons.subscribe(
      (showSideButtons: boolean)  => {
      if (showSideButtons === true){
        this.showSideButtons = true;
        document.getElementById('side-buttons').style.display = 'initial';
      }
      else{
        this.showSideButtons = false;
        document.getElementById('side-buttons').style.display = 'none';
      }
    });
  }

  navigate(path: []) {
    this.router.navigate(path);
  }

  ionViewWillEnter() {
    this.toolbar.loc = '2';
  }
}
