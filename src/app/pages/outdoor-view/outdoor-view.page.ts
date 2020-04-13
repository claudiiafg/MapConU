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
    this.dataSharingService.showSideButtons.subscribe(
      (showSideButtons: boolean)  => {
      this.showSideButtons = showSideButtons;
      if (showSideButtons){
        //this.show
        console.log('not In 3d')
        this.showSideButtons = true;
      }
      else{
        //this.hide
        console.log('In 3d')
        this.showSideButtons = false;
      }
       console.log(this.showSideButtons);
    });
  3}

  ngAfterViewInit(){

  }

  navigate(path: []) {
    this.router.navigate(path);
  }

  ionViewWillEnter() {
    this.toolbar.loc = '2';
  }
}
