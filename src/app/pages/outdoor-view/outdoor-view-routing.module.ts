import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {OutdoorViewPage} from './outdoor-view.page';

const routes: Routes = [
  {
    path: '',
    component: OutdoorViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutdoorViewPageRoutingModule {
}
