import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IndoorViewPage } from './pages/indoor-view/indoor-view.page';
import { OutdoorViewPage } from './pages/outdoor-view/outdoor-view.page';
import { SettingsPage } from './pages/settings/settings.page';

const routes: Routes = [
  { path: 'outdoor', component: OutdoorViewPage },
  { path: 'indoor', component: IndoorViewPage },
  { path: 'appSettings', component: SettingsPage },
  {
    path: 'indoor/:id',
    component: IndoorViewPage
  },
  //redirect to outdoor if path is not recognized
  { path: '**', redirectTo: 'outdoor' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
