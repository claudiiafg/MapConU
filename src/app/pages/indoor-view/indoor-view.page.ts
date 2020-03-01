import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-indoor-view',
  templateUrl: './indoor-view.page.html',
  styleUrls: ['./indoor-view.page.scss']
})
export class IndoorViewPage implements OnInit {
  private sub;
  private building: string;

  constructor(private route: ActivatedRoute) {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.building = params['id'];
      }
    });
  }

  ngOnInit() {}
}
