import { Component, OnInit, NgZone, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, ElementRef, ApplicationRef, Injector } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-openweathermap';

import { ShapeService } from 'src/app/services/shape/shape.service';
import { PopupService } from 'src/app/services/popup/popup.service';
import { MarkerService } from 'src/app/services/marker/marker.service';
import { ShapeDefaultFormat } from 'src/app/environment/styles/global-styles';

import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';
import { MapasService } from '../services/mapas.service';
import { CardInformationComponent } from '../card-component/card-information.component';

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

  public progressComponents: ProgressCircleComponent[] = [];

  private municipiosLayer: L.Layer;
  private municipiosData: any;
  private culiacanCoordinates: [number, number] = [24.7994, -107.3879];

  private arregloEstados = [
    {
      "idmonitoreodiario": 2180899,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "LDCSI",
      "nombreoficial": "Luis Donaldo Colosio, Sin.",
      "nombrecomun": "Huites, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "Choix",
      "regioncna": "Pacífico Norte",
      "latitud": 26.844722,
      "longitud": -108.367778,
      "uso": "GH",
      "corriente": "R. Fuerte",
      "tipovertedor": "Contr",
      "inicioop": "1995",
      "elevcorona": "290.75",
      "bordolibre": 0.75,
      "nameelev": 290,
      "namealmac": 4567.08,
      "namoelev": 274,
      "namoalmac": 3202.16,
      "alturacortina": "164.75",
      "elevacionactual": 223.22,
      "almacenaactual": 701.3,
      "llenano": 0.219008419316961
  },
  {
      "idmonitoreodiario": 2180900,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "PMHSI",
      "nombreoficial": "Miguel Hidalgo, Sin.",
      "nombrecomun": "El Mahoné, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "El Fuerte",
      "regioncna": "Pacífico Norte",
      "latitud": 26.509722,
      "longitud": -108.58,
      "uso": "AP/GH/RI",
      "corriente": "R. Fuerte",
      "tipovertedor": "Mixto",
      "inicioop": "1956",
      "elevcorona": "151.4",
      "bordolibre": 3.4,
      "nameelev": 148,
      "namealmac": 4171.273,
      "namoelev": 142.36,
      "namoalmac": 3312.89,
      "alturacortina": "81",
      "elevacionactual": 122.36,
      "almacenaactual": 1090.4,
      "llenano": 0.329138607077204
  },
  {
      "idmonitoreodiario": 2180901,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "JORSI",
      "nombreoficial": "Josefa Ortiz de Domínguez, Sin.",
      "nombrecomun": "El Sabino, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "El Fuerte",
      "regioncna": "Pacífico Norte",
      "latitud": 26.426944,
      "longitud": -108.7025,
      "uso": "AP/RI",
      "corriente": "A. Alamos",
      "tipovertedor": "Contr",
      "inicioop": "1967",
      "elevcorona": "113.5",
      "bordolibre": 2.93,
      "nameelev": 112.6500015,
      "namealmac": 685.11,
      "namoelev": 109.5,
      "namoalmac": 519.28,
      "alturacortina": "44",
      "elevacionactual": 102.78,
      "almacenaactual": 242.3,
      "llenano": 0.466607610537667
  },
  {
      "idmonitoreodiario": 2180902,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "GDOSI",
      "nombreoficial": "Gustavo Díaz Ordaz, Sin.",
      "nombrecomun": "Bacurato, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "Sinaloa",
      "regioncna": "Pacífico Norte",
      "latitud": 25.856667,
      "longitud": -107.911111,
      "uso": "AP/GH/RI",
      "corriente": "R. Sinaloa",
      "tipovertedor": "Contr",
      "inicioop": "1981",
      "elevcorona": "256",
      "bordolibre": 3.5,
      "nameelev": 252.5,
      "namealmac": 2687.074,
      "namoelev": 237.06,
      "namoalmac": 1618.751,
      "alturacortina": "116",
      "elevacionactual": 220.18,
      "almacenaactual": 790.7,
      "llenano": 0.488463018710104
  },
  {
      "idmonitoreodiario": 2180903,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "GBESI",
      "nombreoficial": "Ing. Guillermo Blake Aguilar, Sin.",
      "nombrecomun": "El Sabinal, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "Sinaloa",
      "regioncna": "Pacífico Norte",
      "latitud": 26.103056,
      "longitud": -108.3275,
      "uso": "AP/RI",
      "corriente": "A. Ocoroni",
      "tipovertedor": "Libre",
      "inicioop": "1985",
      "elevcorona": "201.2",
      "bordolibre": 4.59,
      "nameelev": 196.6100006,
      "namealmac": 469.2,
      "namoelev": 188.4499969,
      "namoalmac": 294.578,
      "alturacortina": "81.2",
      "elevacionactual": 180.82,
      "almacenaactual": 176.422,
      "llenano": 0.598897405780472
  },
  {
      "idmonitoreodiario": 2180904,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "EBLSI",
      "nombreoficial": "Lic. Eustaquio Buelna, Sin.",
      "nombrecomun": "Guamúchil, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "Salvador Alvarado",
      "regioncna": "Pacífico Norte",
      "latitud": 25.484722,
      "longitud": -108.065556,
      "uso": "AP/RI",
      "corriente": "R. Mocorito",
      "tipovertedor": "Contr",
      "inicioop": "1972",
      "elevcorona": "71.2",
      "bordolibre": 2.35,
      "nameelev": 68.84999847,
      "namealmac": 264.9500122,
      "namoelev": 63.54,
      "namoalmac": 80.08,
      "alturacortina": "41",
      "elevacionactual": 60.54,
      "almacenaactual": 31.8,
      "llenano": 0.397102897102897
  },
  {
      "idmonitoreodiario": 2180905,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "ALMSI",
      "nombreoficial": "Adolfo López Mateos, Sin.",
      "nombrecomun": "El Humaya o El Varejonal, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "Badiraguato",
      "regioncna": "Pacífico Norte",
      "latitud": 25.101389,
      "longitud": -107.388333,
      "uso": "AP/RI",
      "corriente": "R. Humaya",
      "tipovertedor": "Libre",
      "inicioop": "1964",
      "elevcorona": "186.5",
      "bordolibre": 3.02,
      "nameelev": 183.4799957,
      "namealmac": 4034.52002,
      "namoelev": 176,
      "namoalmac": 3086.610107,
      "alturacortina": "105.5",
      "elevacionactual": 150.75,
      "almacenaactual": 914.1,
      "llenano": 0.296150135038743
  },
  {
      "idmonitoreodiario": 2180906,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "JGRSI",
      "nombreoficial": "Juan Guerrero Alcocer, Sin.",
      "nombrecomun": "Vinoramas, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "Culiacán",
      "regioncna": "Pacífico Norte",
      "latitud": 24.753611,
      "longitud": -107.059444,
      "uso": "RI",
      "corriente": "A. El Bledal",
      "tipovertedor": "Libre",
      "inicioop": "1994",
      "elevcorona": "178.3",
      "bordolibre": 2.02,
      "nameelev": 176.2799988,
      "namealmac": 102,
      "namoelev": 168.5,
      "namoalmac": 54.684,
      "alturacortina": "50",
      "elevacionactual": 152.73,
      "almacenaactual": 7.646,
      "llenano": 0.139821520005851
  },
  {
      "idmonitoreodiario": 2180907,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "SNLSI",
      "nombreoficial": "Sanalona, Sin.",
      "nombrecomun": "Sanalona, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "Culiacán",
      "regioncna": "Pacífico Norte",
      "latitud": 24.815,
      "longitud": -107.151389,
      "uso": "AP/GH/RI",
      "corriente": "R. Tamazula",
      "tipovertedor": "Libre",
      "inicioop": "1948",
      "elevcorona": "165",
      "bordolibre": 2.83,
      "nameelev": 162.17,
      "namealmac": 987.522,
      "namoelev": 156.2,
      "namoalmac": 687.988,
      "alturacortina": "81",
      "elevacionactual": 147.4,
      "almacenaactual": 363.2,
      "llenano": 0.527916184584614
  },
  {
      "idmonitoreodiario": 2180908,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "JLPSI",
      "nombreoficial": "José López Portillo, Sin.",
      "nombrecomun": "Comedero, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "Cosalá",
      "regioncna": "Pacífico Norte",
      "latitud": 24.571667,
      "longitud": -106.807222,
      "uso": "AP/GH/RI",
      "corriente": "R. San Lorenzo",
      "tipovertedor": "Contr",
      "inicioop": "1981",
      "elevcorona": "290",
      "bordolibre": 4.54999,
      "nameelev": 286.9500122,
      "namealmac": 3966.169922,
      "namoelev": 272.16,
      "namoalmac": 2580.19,
      "alturacortina": "136",
      "elevacionactual": 235.17,
      "almacenaactual": 611.6,
      "llenano": 0.237036807366899
  },
  {
      "idmonitoreodiario": 2180914,
      "fechamonitoreo": "2023-12-05",
      "clavesih": "SLTSI",
      "nombreoficial": "Ing. Aurelio Benassini Vizcaíno, Sin.",
      "nombrecomun": "El Salto o Elota, Sin.",
      "estado": "Sinaloa",
      "nommunicipio": "Elota",
      "regioncna": "Pacífico Norte",
      "latitud": 24.121944,
      "longitud": -106.695833,
      "uso": "RI",
      "corriente": "R. Elota",
      "tipovertedor": "Libre",
      "inicioop": "1988",
      "elevcorona": "167.1",
      "bordolibre": 2.46,
      "nameelev": 164.6399994,
      "namealmac": 815.592,
      "namoelev": 154.5,
      "namoalmac": 403.9,
      "alturacortina": "73",
      "elevacionactual": 148.16,
      "almacenaactual": 241.9,
      "llenano": 0.59891062144095
  }]

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
    for (let estado of this.arregloEstados){
    /*const svgElementBounds = [[estado.latitud, estado.longitud]];
    this.progressComponent.percentage = estado.llenano * 100;
    this.cdr.detectChanges();
    const svgElement = this.progressComponent.getSvgElement();

     // Puedes utilizar el método 'bindPopup' para agregar información emergente al marcador
     const marker = L.marker([estado.latitud, estado.longitud])
     .bindPopup(`<b>${estado.nombreoficial}</b><br>Porcentaje: ${estado.llenano * 100}%`)
     .addTo(this.map);

   // Agrega el marcador SVG como un overlay al marcador
   marker.bindTooltip(svgElement, { permanent: true, direction: 'right' });

   // O puedes agregar el marcador SVG como overlay directamente al mapa
   // L.svgOverlay(svgElement, svgElementBounds).addTo(this.map);*/

  

      // Crea un nuevo contenedor SVG para cada estado
      const progressComponent = this.mapasService.createProgressComponent();
      const llenado = estado.llenano * 100
      progressComponent.setPercentage(llenado.toFixed(2));
      progressComponent.setData(estado);
      this.progressComponents.push(progressComponent);

    }
    setTimeout(() => {
      for (let progressComponent of this.progressComponents){
        this.agregarMarcadorConPopup(progressComponent);
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
    const marker = L.marker([lat, lng])
      .bindPopup(popupComponentRef.location.nativeElement, {
        className: 'custom-popup', // Clase para el popup
      }) // Usar el elemento nativo del componente
      .addTo(this.map);

    // Crear un contenedor para el elemento SVG y agregar un tooltip al marcador
    const svgContainer = document.createElement('div');
    svgContainer.innerHTML = progressComponent.getSvgElement().outerHTML;
    marker.bindTooltip(svgContainer, { permanent: true, direction: 'right' });
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
