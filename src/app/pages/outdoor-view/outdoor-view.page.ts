import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "app-outdoor-view",
  templateUrl: "./outdoor-view.page.html",
  styleUrls: ["./outdoor-view.page.scss"]
})
export class OutdoorViewPage implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  navigate(path: []) {
    this.router.navigate(path);
  }
}
