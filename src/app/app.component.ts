import { Component, NgZone, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-openweathermap';

@Component({
  selector: 'app-root',
  template: `
    <div id="map"></div>
    <button id="refreshButton">Refresh Button</button>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public cloudsLayer: L.Layer;
  public RainsLayer: L.Layer;
  public windLayer: L.Layer;
  public map: L.Map;

  constructor(private ngZone: NgZone ) {}


  ngOnInit() {
    // Coordenadas de Culiacán
    const culiacanCoordinates: [number, number] = [24.7994, -107.3879];

    // Crear el mapa centrado en Culiacán
    this.map = L.map('map').setView(culiacanCoordinates, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      noWrap: true, 
      maxZoom: 18
    }).addTo(this.map);

      // Agregar un botón personalizado al mapa
      const customControl = L.control({ position: 'topleft' });

      customControl.onAdd =  () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control weather-button');
  
        const button = L.DomUtil.create('a', 'leaflet-control-button weather-button', container);
        button.innerHTML = 'N';
        button.href = '#';
          L.DomEvent.on(button, 'click',  () => {
            // Acción al hacer clic en el botón
            this.ngZone.run(()=>{
              this.toggleCloudsLayer();
            })
            
          });
       
        return container;
      };
  
      customControl.addTo(this.map);


            // Agregar un botón personalizado al mapa
            const customControl2 = L.control({ position: 'topleft' });

            customControl2.onAdd =  () => {
              const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control weather-button');
        
              const button = L.DomUtil.create('a', 'leaflet-control-button weather-button bi bi-cloud-fill', container);
              button.innerHTML = 'Ll';
              button.href = '#';
                L.DomEvent.on(button, 'click',  () => {
                  // Acción al hacer clic en el botón
                  this.ngZone.run(()=>{
                    this.toggleRainsLayer();
                  })
                  
                });
             
              return container;
            };
        
            customControl2.addTo(this.map);

      // Agregar un botón personalizado al mapa
      const customControl3 = L.control({ position: 'topleft' });

      customControl3.onAdd =  () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control weather-button');
  
        const button = L.DomUtil.create('a', 'leaflet-control-button weather-button', container);
        button.innerHTML = 'V';
        button.href = '#';
          L.DomEvent.on(button, 'click',  () => {
            // Acción al hacer clic en el botón
            this.ngZone.run(()=>{
              this.toggleWindLayer();
            })
            
          });
       
        return container;
      };
  
      customControl3.addTo(this.map);

   /* // Configuración de la capa de nubosidad de OpenWeatherMap
    const cloudsLayer = L.OWM.clouds({
      opacity: 0.8, // Opacidad de la capa de nubosidad
      legendImagePath: 'path-to-legend-image.png' // Ruta de la imagen de la leyenda (opcional)
    }).addTo(map);*/

    /*const cloudsLayer = L.OWM.clouds({
      opacity: 1, // Opacidad de la capa de nubosidad
      appId: '05ee994525263678a5f1e95438fe9735' 
    }).addTo(map);*/

   /* const cloudsLayerClasic =  L.OWM.cloudsClassic({appId: '05ee994525263678a5f1e95438fe9735'}).addTo(map);*/
    
    // Puedes acceder a la capa de nubosidad para realizar ajustes adicionales si es necesario
    // Por ejemplo, cloudsLayer.setOpacity(0.6);
  }

  
  public toggleCloudsLayer() {
    // Verificar si la capa de nubosidad ya está presente en el mapa
    if (this.cloudsLayer) {
      // Si está presente, quitar la capa de nubosidad
      this.map.removeLayer(this.cloudsLayer);
      this.cloudsLayer = null; // Restablecer la referencia
    } else {
      // Si no está presente, agregar la capa de nubosidad
      this.cloudsLayer = L.OWM.clouds({
        opacity: 1,
        appId: '05ee994525263678a5f1e95438fe9735'  // Reemplaza con tu clave de API
      }).addTo(this.map);
   }
  }

  
  public toggleRainsLayer() {
    // Verificar si la capa de nubosidad ya está presente en el mapa
    if (this.RainsLayer) {
      // Si está presente, quitar la capa de nubosidad
      this.map.removeLayer(this.RainsLayer);
      this.RainsLayer = null; // Restablecer la referencia
    } else {
      // Si no está presente, agregar la capa de nubosidad
      this.RainsLayer = L.OWM.rain({
        opacity: 0.8,
        appId: '05ee994525263678a5f1e95438fe9735'  // Reemplaza con tu clave de API
      }).addTo(this.map);
   }
  }

  public toggleWindLayer() {
    // Verificar si la capa de nubosidad ya está presente en el mapa
    if (this.windLayer) {
      // Si está presente, quitar la capa de nubosidad
      this.map.removeLayer(this.windLayer);
      this.windLayer = null; // Restablecer la referencia
    } else {
      // Si no está presente, agregar la capa de nubosidad
      this.windLayer = L.OWM.wind({
        opacity: 0.8,
        appId: '05ee994525263678a5f1e95438fe9735'  // Reemplaza con tu clave de API
      }).addTo(this.map);
   }
  }


}