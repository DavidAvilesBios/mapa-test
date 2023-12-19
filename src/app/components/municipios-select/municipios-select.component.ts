import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { municipios } from './data';
import { MapasService } from '../services/mapas.service';
import { ClimaMunicipio, PronosticoDia } from '../services/typings';

@Component({
  selector: 'app-municipios-select',
  templateUrl: './municipios-select.component.html',
  styleUrls: ['./municipios-select.component.scss']
})
export class MunicipiosSelectComponent implements OnInit {

  @Output() toggleMunicipio: EventEmitter<any> = new EventEmitter();

  public iconClass: string = "fa-solid fa-caret-up";
  public isButtonActive: boolean = false;
  public municipios = municipios;
  public esMunicipioActivo: boolean = false;
  public municipioClima: ClimaMunicipio;
  public pronosticosClima: PronosticoDia[];

  constructor(
    private _mapasService: MapasService
  ) { }

  ngOnInit(): void {
    this._mapasService.climaMunicipio$.subscribe((value: ClimaMunicipio) => {
      this.municipioClima = value;
    });

    this._mapasService.pronosticosMunicipio$.subscribe((value: any) => {
      this.pronosticosClima = value;
    });
  }

  handleButtonClick() {
    this.toggleDropdown()
  }

  manejarMunicipioClick(idMunicipio: number) {
    this.toggleMunicipio.emit(idMunicipio);
    this.toggleEsBotonActivo();
    this.toggleEsMunicipioActivo();
  }

  manejarBotonClimaClick() {
    this.toggleMunicipio.emit(0);
    this.toggleEsMunicipioActivo();
    this.toggleEsBotonActivo();
  }

  toggleEsMunicipioActivo() {
    this.esMunicipioActivo = !this.esMunicipioActivo;
  }

  toggleEsBotonActivo() {
    this.isButtonActive = !this.isButtonActive;
  }

  private toggleDropdown() {
    this.isButtonActive = !this.isButtonActive;
    this.iconClass = this.isButtonActive ? 'fa-solid fa-caret-down' : 'fa-solid fa-caret-up';
  }

}
