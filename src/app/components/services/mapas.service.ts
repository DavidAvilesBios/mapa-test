import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import * as L from 'leaflet';
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { ShapeService } from 'src/app/services/shape/shape.service';
import { FeatureCollection } from './typings';
import { ShapeDefaultFormat } from 'src/app/environment/styles/global-styles';

@Injectable({
  providedIn: 'root'
})
export class MapasService {

  private progressComponents: ProgressCircleComponent[] = [];
  private pieChartComponents: PieChartComponent[] = [];

  private municipioShape: any;
  private municipioLayer: L.Layer;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private _shapeService: ShapeService
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

  removeLayerFromMap(map: L.Map, layer: L.Layer) {
    if(layer) {
      map.removeLayer(layer);
    }
  }

  addMunicipioLayer(map: L.Map, idMunicipio: number) {
    this._shapeService.getSinaloaShape()
    .subscribe((featureCollection: FeatureCollection) => {
      const municipioDeseado = featureCollection.features.find((municipio) => municipio.properties.id == idMunicipio);

      if(municipioDeseado) {
        this.removeLayerFromMap(map, this.municipioLayer);
        this.municipioShape = municipioDeseado;
        this.municipioLayer = L.geoJSON(this.municipioShape, {
          style: (feature) => (ShapeDefaultFormat)
        });

        map.addLayer(this.municipioLayer);
      }
    });
  }

  removeMunicipioLayer(map: L.Map) {
    if(this.municipioLayer) {
      this.removeLayerFromMap(map, this.municipioLayer);
    }
  }


}
