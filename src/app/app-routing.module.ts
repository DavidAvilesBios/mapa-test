import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './components/Map/map.component';
import { ProgressCircleComponent } from './components/progress-circle/progress-circle.component';

const routes: Routes = [
  {path: 'map', component: MapComponent},
  {path: 'progress', component: ProgressCircleComponent},
  {path: '**', redirectTo: '/map'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
