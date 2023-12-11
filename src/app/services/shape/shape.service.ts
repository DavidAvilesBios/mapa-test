import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
