import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShapeService } from './services/shape/shape.service';
import { HttpClientModule } from '@angular/common/http';
import { PopupService } from './services/popup/popup.service';
import { MapComponent } from './components/Map/map.component';
import { MarkerService } from './services/marker/marker.service';
import { ProgressCircleComponent } from './components/progress-circle/progress-circle.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ProgressCircleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    ShapeService,
    PopupService,
    MarkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
