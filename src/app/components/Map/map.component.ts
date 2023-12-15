import { Component, OnInit, NgZone, ComponentFactoryResolver, ChangeDetectorRef, ElementRef, ApplicationRef, Injector } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-openweathermap';
import * as dayjs from 'dayjs'

import { ShapeService } from 'src/app/services/shape/shape.service';
import { ShapeDefaultFormat } from 'src/app/environment/styles/global-styles';

import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';
import { MapasService } from '../services/mapas.service';
import { CardInformationComponent } from '../card-component/card-information.component';

import { arregloEstados } from 'src/assets/data/estados';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { CloudLayer } from 'src/app/types/CloudLayer';

@Component({
  selector: 'app-map',
  templateUrl: `./map.component.html`,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public cloudsLayer: L.Layer;
  public RainsLayer: L.Layer;
  public windLayer: L.Layer;
  public capaNubesActivas: L.Layer;
  public map: L.Map;

  public progressComponents: ProgressCircleComponent[] = [];
  public pieChartComponents: PieChartComponent[] = [];

  private municipiosLayer: L.Layer;
  private presasLayer: L.LayerGroup = L.layerGroup();
  private municipiosData: any;
  private culiacanCoordinates: [number, number] = [24.7994, -107.3879];
  private arregloTiempoUnix: CloudLayer[] = [];
  private APP_ID: string = 'beebbcb80ce2f079e73c30c198d013fe';

  public isCloudsActive = false;
  public isMunicipiosActive = false;
  public isPresasActive = false;
  public isRainActive = false;
  public isWindActive = false;
  public esNubesActivo: boolean = false;

  constructor(
    private ngZone: NgZone,
    private _shapeService: ShapeService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private inj: Injector,
    private applicationRef: ApplicationRef,
    private mapasService: MapasService
  ) { }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private initializeMap() {
    this.ngZone.run(() => {
      for (let estado of arregloEstados) {
        // Crea un nuevo contenedor SVG para cada estado
        //const progressComponent = this.mapasService.createProgressComponent();
        const pieChartComponent = this.mapasService.createPieChartComponent();
        const llenado = estado.llenano * 100
        pieChartComponent.setPercentage(llenado.toFixed(2));
        pieChartComponent.setData(estado);
        this.pieChartComponents.push(pieChartComponent);

      }
      setTimeout(() => {

        for (let pieChartComponent of this.pieChartComponents) {
          this.agregarMarcadorConPopup(pieChartComponent);
        }
      }, 1000);

      this.cdr.detectChanges();
    });
  }

  private async agregarMarcadorConPopup(progressComponent: any) {
    const estado = progressComponent.data;
    const lat = estado.latitud;
    const lng = estado.longitud;

    // Crear el componente de información emergente
    const popupComponentRef = this.crearPopupComponent(estado);

    // Crear un marcador con la información emergente y agregarlo al mapa
    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'cursor-pointer',
        iconAnchor: [20, 20],
        iconSize: [40, 40],
      }),
      opacity: 0
    })
      .bindPopup(popupComponentRef.location.nativeElement, {
        className: 'custom-popup',
      });

    // Crear un contenedor para el elemento SVG y agregar un tooltip al marcador
    const svgContainer = document.createElement('div');
    svgContainer.classList.add('leaflet-tooltip-custom');
    svgContainer.innerHTML = progressComponent.getSvgElement().outerHTML;
    marker.bindTooltip(svgContainer, {
      permanent: true,
      direction: 'left'
    });

    this.mapasService.addLayerToLayerGroup(marker, this.presasLayer);
  }

  private crearPopupComponent(estado: any) {
    // Crear el componente y asociarlo con el elemento
    const popupComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(CardInformationComponent)
      .create(this.inj);

    // Asignar propiedades al componente
    popupComponentRef.instance.properties = estado;

    // Aplicar estilos al componente (en este caso, establecer un tamaño)
    const popupComponentElement = popupComponentRef.location.nativeElement;
    popupComponentElement.style.maxWidth = '300px'; // Puedes ajustar el tamaño según tus necesidades

    // Adjuntar el componente al DOM
    this.applicationRef.attachView(popupComponentRef.hostView);

    return popupComponentRef;
  }


  ngOnInit() {
    this.map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
    }).setView(this.culiacanCoordinates, 8);

    const tiles: any = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    var maxBounds = L.latLngBounds(
      L.latLng(-90, -Infinity),
      L.latLng(90, Infinity)
    );

    this.map.setMaxBounds(maxBounds);

    this.getMunicipios();
    this.crearArregloDeTiemposUnix();
  }

  handleMunicipiosButtonClick() {
    this.toggleMunicipiosLayer();
    this.isMunicipiosActive = !this.isMunicipiosActive;
  }

  handleCloudsButtonClick() {
    this.esNubesActivo = !this.esNubesActivo;
    this.alternaCapaDeNubesActiva();

    //this.toggleCloudsLayer();
    //this.isCloudsActive = !this.isCloudsActive;
  }

  handleRainButtonClick() {
    this.toggleRainsLayer();
    this.isRainActive = !this.isRainActive;
  }

  handleWindButtonClick() {
    this.toggleWindLayer();
    this.isWindActive = !this.isWindActive;
  }

  handlePresasButtonClick() {
    this.togglePresasLayer();
    this.isPresasActive = !this.isPresasActive;
  }

  handleMunicipioClick(idMunicipio: number) {
    if (idMunicipio > 0) {
      this.mapasService.addMunicipioLayer(this.map, idMunicipio);
    } else {
      this.mapasService.removeMunicipioLayer(this.map);
    }
  }

  private toggleMunicipiosLayer() {
    if (this.isMunicipiosActive) {
      this.map.removeLayer(this.municipiosLayer);
      this.municipiosLayer = null;
    } else {
      this.setMunicipiosLayer();
      this.map.addLayer(this.municipiosLayer);
    }
  }

  private togglePresasLayer() {
    if (this.isPresasActive) {
      this.map.removeLayer(this.presasLayer);
    } else {
      this.map.addLayer(this.presasLayer);
    }
  }


  public toggleCloudsLayer() {
    if (this.isCloudsActive) {
      this.map.removeLayer(this.cloudsLayer);
      this.cloudsLayer = null;
    } else {
      this.cloudsLayer = L.OWM.clouds({
        appId: '05ee994525263678a5f1e95438fe9735',
        opacity: 0.8
      }).addTo(this.map);
    }
  }

  public alternaCapaDeNubesActiva() {
    if (this.esNubesActivo) {
      this.actualizaCapaNubes(this.arregloTiempoUnix[0]);
    } else {
      this.map.removeLayer(this.capaNubesActivas);
      this.capaNubesActivas = null;
    }
  }


  public toggleRainsLayer() {
    if (this.RainsLayer) {
      this.map.removeLayer(this.RainsLayer);
      this.RainsLayer = null;
    } else {
      this.RainsLayer = L.OWM.rain({
        opacity: 0.8,
        appId: '05ee994525263678a5f1e95438fe9735'
      }).addTo(this.map);
    }
  }

  public toggleWindLayer() {
    if (this.isWindActive) {
      this.map.removeLayer(this.windLayer);
      this.windLayer = null;
    } else {
      this.windLayer = L.OWM.wind({
        opacity: 0.8,
        appId: '05ee994525263678a5f1e95438fe9735'
      }).addTo(this.map);
    }
  }

  private getMunicipios() {
    this._shapeService.getSinaloaShape()
      .subscribe(municipios => {
        this.municipiosData = municipios;
      });
  }

  private setMunicipiosLayer() {
    this.municipiosLayer = L.geoJSON(this.municipiosData, {
      style: (feature) => (ShapeDefaultFormat)
    });
  }

  private actualizaCapaNubes(tiempoUnixParam?: CloudLayer) {
    if (this.esNubesActivo) {

      const { tiempoUnix, capaMapa } = tiempoUnixParam;

      if(this.capaNubesActivas) {
        this.map.removeLayer(this.capaNubesActivas);
      }

      this.capaNubesActivas = capaMapa;
      this.map.addLayer(this.capaNubesActivas);

      const unixIndex = this.arregloTiempoUnix.findIndex((tiempo) => tiempo == tiempoUnixParam);
      if(unixIndex == this.arregloTiempoUnix.length - 1) {
        setTimeout(() => {
          this.actualizaCapaNubes(this.arregloTiempoUnix[0]);
        }, 3500);
      } else {
        setTimeout(() => {
          this.actualizaCapaNubes(this.arregloTiempoUnix[ unixIndex + 1 ]);
        }, 3500)
      }
    }
  }

  private crearArregloDeTiemposUnix() {
    for (let i = 27; i >= 0; i -= 3) {
      const tiempoUnix = dayjs().subtract(i, 'hours').unix();
      const capaMapa = L.tileLayer(`http://maps.openweathermap.org/maps/2.0/weather/CL/{z}/{x}/{y}?date=${tiempoUnix}&opacity=1&fill_bound=true&appid=${this.APP_ID}`);
      this.arregloTiempoUnix.push({tiempoUnix, capaMapa});
    }
  }

}
