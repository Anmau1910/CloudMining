import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Routes
import { MainComponent } from './comps/main/main.component';
import { DataVisualizationComponent } from './comps/data-visualization/data-visualization.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch:"full"},
  { path: 'main', component: MainComponent},
  { path: 'datavisualization', component: DataVisualizationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
