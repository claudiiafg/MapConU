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
        console.log('not In 3d')
        this.showSideButtons = true;
        document.getElementById('side-buttons').style.display = 'initial';
      }
      else{
        console.log('In 3d')
        this.showSideButtons = false;
        document.getElementById('side-buttons').style.display = 'none';
      }
      console.log(this.showSideButtons);
    });
  }

  navigate(path: []) {
    this.router.navigate(path);
  }

  ionViewWillEnter() {
    this.toolbar.loc = '2';
  }
}
