import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {OutdoorViewPage} from "./pages/outdoor-view/outdoor-view.page";
import {IndoorViewPage} from "./pages/indoor-view/indoor-view.page";

const routes: Routes = [
  {path: "outdoor", component: OutdoorViewPage},
  {path: "indoor", component: IndoorViewPage},
  //redirect to outdoor if path is not recognized
  {path: "**", redirectTo: "outdoor"}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
