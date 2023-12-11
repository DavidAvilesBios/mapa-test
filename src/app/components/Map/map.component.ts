import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-openweathermap';

import { ShapeService } from 'src/app/services/shape/shape.service';
import { PopupService } from 'src/app/services/popup/popup.service';
import { MarkerService } from 'src/app/services/marker/marker.service';
import { ShapeDefaultFormat } from 'src/app/environment/styles/global-styles';

import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';

@Component({
  selector: 'app-map',
  templateUrl: `./map.component.html`,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public cloudsLayer: L.Layer;
  public RainsLayer: L.Layer;
  public windLayer: L.Layer;
  public map: L.Map;

  @ViewChild(ProgressCircleComponent) progressComponent: ProgressCircleComponent;

  private municipiosLayer: L.Layer;
  private municipiosData: any;
  private culiacanCoordinates: [number, number] = [24.7994, -107.3879];

  constructor(
    private ngZone: NgZone,
    private _shapeService: ShapeService,
    private _popupService: PopupService,
    private _markerService: MarkerService
  ) { }

  ngAfterViewInit() {
    var svgElementBounds = [ [ 26.844722, -108.367778 ], [ 29, -115.367778 ] ];
    L.svgOverlay(this.progressComponent, svgElementBounds).addTo(this.map);
  }


  ngOnInit() {

    this.map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
    }).setView(this.culiacanCoordinates, 10);

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

    this.calculateStrokeDashOffset();

    setTimeout(() => {
     
    }, 5000);
  }

  handleMunicipiosButtonClick() {
    this.toggleMunicipiosLayer();
  }

  handleCloudsButtonClick() {
    this.toggleCloudsLayer();
  }

  handleRainButtonClick() {
    this.toggleRainsLayer();
  }

  handleWindButtonClick() {
    this.toggleWindLayer();
  }

  private toggleMunicipiosLayer() {
    if (this.municipiosLayer) {
      this.map.removeLayer(this.municipiosLayer);
      this.municipiosLayer = null;
    } else {
      this.setMunicipiosLayer();
      this.map.addLayer(this.municipiosLayer);
    }
  }


  public toggleCloudsLayer() {
    if (this.cloudsLayer) {
      this.map.removeLayer(this.cloudsLayer);
      this.cloudsLayer = null;
    } else {
      L.OWM.clouds({
        appId: '05ee994525263678a5f1e95438fe9735',
        opacity: 0.8
      }).addTo(this.map);
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
    if (this.windLayer) {
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


  // ======================================== MARKER ===================================================

  private circumference: number = 565.48;
  private strokeDashOffset: number = 0;

  handleDamButtonClick() {
    this.toggleDamLayer();
  }

  private toggleDamLayer() {
    //this._markerService.setDamMarker(this.map, 0, this.culiacanCoordinates);
    const marker = L.marker(this.culiacanCoordinates);
    this.calculateStrokeDashOffset();
    //marker.bindPopup(this._popupService.getPieChart(percentage));
    marker.bindPopup(`
      <div class="progress-bar-container">
        <h2>
          <label for="css">CSS</label>
        </h2>
        <div class="progress-bar css">
          <div id="css" min="0" max="100" value="85"></div>
        </div>
      </div>
    `);
    marker.addTo(this.map);
  }

  //https://github.com/bluehalo/ngx-leaflet/issues/178#issuecomment-1140350658

  private calculateStrokeDashOffset(): void {
    this.strokeDashOffset = this.circumference * (1 - 50 / 100);
  }

}
