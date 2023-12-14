import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from 'src/app/components/services/typings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor(
    private http: HttpClient
  ) { }

  getSinaloaShape() {
    return this.http.get('/../../assets/data/sinaloa_municipios.json');
  }
}
