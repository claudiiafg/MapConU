import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {OutdoorViewPage} from "../outdoor-view/outdoor-view.page";

import {IndoorViewPage} from "./indoor-view.page";

const routes: Routes = [
  {
    path: "",
    component: IndoorViewPage
  },
  {path: "outdoor", component: OutdoorViewPage}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndoorViewPageRoutingModule {
}
