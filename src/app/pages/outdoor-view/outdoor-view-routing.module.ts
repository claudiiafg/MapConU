import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutdoorViewPage } from './outdoor-view.page';
import { IndoorViewPage } from '../indoor-view/indoor-view.page';

const routes: Routes = [
  {
    path: '',
    component: OutdoorViewPage
  },
  { path: 'indoor', component: IndoorViewPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutdoorViewPageRoutingModule {}
