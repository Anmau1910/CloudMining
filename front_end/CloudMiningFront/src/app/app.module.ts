import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MainComponent } from './comps/main/main.component';
import { DataVisualizationComponent } from './comps/data-visualization/data-visualization.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatIconModule } from '@angular/material/icon';
import { ScatterComponent } from './comps/scatter/scatter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { BoxComponent } from './comps/box/box.component';
import { BarComponent } from './comps/bar/bar.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DataVisualizationComponent,
    ScatterComponent,
    BoxComponent,
    BarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    CommonModule,
    MatCheckboxModule,
    MatCardModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    MatPaginatorModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
