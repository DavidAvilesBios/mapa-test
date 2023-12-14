import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShapeService } from './services/shape/shape.service';
import { HttpClientModule } from '@angular/common/http';
import { PopupService } from './services/popup/popup.service';
import { MapComponent } from './components/Map/map.component';
import { MarkerService } from './services/marker/marker.service';
import { ProgressCircleComponent } from './components/progress-circle/progress-circle.component';
import { CardInformationComponent } from './components/card-component/card-information.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { MunicipiosSelectComponent } from './components/municipios-select/municipios-select.component';

registerLocaleData(localeEs, 'es-MX');

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ProgressCircleComponent,
    CardInformationComponent,
    PieChartComponent,
    MunicipiosSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    ShapeService,
    PopupService,
    MarkerService,
    {provide: LOCALE_ID, useValue: 'es-MX'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
