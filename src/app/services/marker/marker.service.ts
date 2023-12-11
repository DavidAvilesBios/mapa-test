import { Injectable } from '@angular/core';
import { PopupService } from '../popup/popup.service';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(
    private _popupService: PopupService
  ) {

  }

  setDamMarker(map: L.Map, percentage: number, coordinates: number[]): void {
    if(coordinates.length > 1) {
      const marker = L.marker(coordinates);
  
      //marker.bindPopup(this._popupService.getPieChart(percentage));
      marker.bindPopup('<app-progress-circle percentage="75"></app-progress-circle>');
      marker.addTo(map);
    }
  }
}
