import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {IndoorViewPage} from './indoor-view.page';

const routes: Routes = [
  {
    path: '',
    component: IndoorViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndoorViewPageRoutingModule {
}
