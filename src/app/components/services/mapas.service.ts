import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import * as L from 'leaflet';
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

@Injectable({
  providedIn: 'root'
})
export class MapasService {

  private progressComponents: ProgressCircleComponent[] = [];
  private pieChartComponents: PieChartComponent[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  createProgressComponent(): ProgressCircleComponent {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ProgressCircleComponent);
    const componentRef = factory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    this.progressComponents.push(componentRef.instance);

    return componentRef.instance;
  }

  removeProgressComponent(component: ProgressCircleComponent): void {
    const index = this.progressComponents.indexOf(component);
    if (index !== -1) {
      this.progressComponents.splice(index, 1);
    }
  }

  createPieChartComponent(): PieChartComponent {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PieChartComponent);
    const componentRef = factory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    this.pieChartComponents.push(componentRef.instance);

    return componentRef.instance;
  }

  removePieChartComponent(component: PieChartComponent): void {
    const index = this.pieChartComponents.indexOf(component);
    if (index !== -1) {
      this.progressComponents.splice(index, 1);
    }
  }

  addLayerToLayerGroup(layer: L.Layer, layerGroup: L.LayerGroup) {
    layerGroup.addLayer(layer);
  }
  
  removeLayerFromLayerGroup(layer: L.Layer, layerGroup: L.LayerGroup) {
    layerGroup.removeLayer(layer);
  }


}
