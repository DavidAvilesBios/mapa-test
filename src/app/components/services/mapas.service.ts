import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import * as L from 'leaflet';
import * as dayjs from 'dayjs'
require('dayjs/locale/es');

import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { ShapeService } from 'src/app/services/shape/shape.service';
import { ClimaMunicipio, Coordenadas, FeatureCollection, GeoCodingApiResponse, Pronostico, PronosticoDia } from './typings';
import { ShapeDefaultFormat } from 'src/app/environment/styles/global-styles';

@Injectable({
  providedIn: 'root'
})
export class MapasService {
  private API_KEY = 'OPEN_WEATHER_API_KEY';

  private progressComponents: ProgressCircleComponent[] = [];
  private pieChartComponents: PieChartComponent[] = [];

  private municipioShape: any;
  private municipioLayer: L.Layer;

  private climaMunicipioSubject = new BehaviorSubject<Object>({});
  climaMunicipio$: Observable<Object> = this.climaMunicipioSubject.asObservable();

  private pronosticosMunicipioSubject = new BehaviorSubject<any>([]);
  pronosticosMunicipio$: Observable<any> = this.pronosticosMunicipioSubject.asObservable();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private _shapeService: ShapeService,
    private _http: HttpClient
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
        this.obtenerMunicipioClima(municipioDeseado.properties.coordinates, municipioDeseado.properties.name);
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

  async obtenerMunicipioClima(coordenadas: Coordenadas, nombre: string) {
    const { lat, lon } = coordenadas;
    dayjs.locale('es-MX');

    this._http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&lang=es&units=metric`)
    .subscribe((result: ClimaMunicipio) => {
      const iconoId = result.weather[0].icon;
      const iconoURL = this.obtenerIconoClima(iconoId, true);

      this.establecerClimaMunicipio({...result, name: nombre, icono:iconoURL });
    });

    this._http.get(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=4&units=metric&lang=es&appid=${this.API_KEY}`)
    .subscribe((result: Pronostico) => {
      const { list } = result;
      list.forEach((dia) => {
        const nombreDia = dayjs.unix(dia.dt).format('dddd').toUpperCase();
        dia.dt_full = nombreDia;
        dia.weather[0].icon = this.obtenerIconoClima(dia.weather[0].icon, false);
        dia.weather[0].description = dia.weather[0].description.toUpperCase();
      })
      this.establecerPronosticosMunicipio(result.list);
    });
  }

  establecerClimaMunicipio(climaData: ClimaMunicipio) {
    this.climaMunicipioSubject.next(climaData);
  }

  establecerPronosticosMunicipio(pronosticosData: PronosticoDia[]) {
    this.pronosticosMunicipioSubject.next(pronosticosData);
  }

  obtenerIconoClima(idIcono: string, isXL: boolean) {
    return `https://openweathermap.org/img/wn/${idIcono}${isXL? '@2x' : ''}.png`;
  }


}
