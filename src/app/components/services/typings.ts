export interface FeatureCollection {
  type: string;
  features: any[];
}

export type GeoCodingApiResponse = {
  name: string;
  local_names: Object;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export type ClimaMunicipio = {
  coord: object;
  weather: any[];
  base: string;
  main: object;
  visibility: number;
  wind: object;
  clouds: object;
  dt: number;
  sys: object;
  timezone: number;
  id: number;
  name: string;
  cod: number;
  icono: string;
}

export type Coordenadas = {
  lat: number;
  lon: number;
}

export type Pronostico = {
  city: {
    id: number,
    name: string,
    coord: Coordenadas,
    country: string,
    population: number,
    timezone: number
  },
  cod: number,
  message: number,
  cnt: number,
  list: PronosticoDia[]
}

export type PronosticoDia = {
  dt: number,
  dt_full?: string,
  sunrise: number,
  sunset: number,
  temp: {
    day: number,
    min: number,
    max: number,
    night: number,
    eve: number,
    morn: number
  },
  feels_like: {
    day: number,
    night: number,
    eve: number,
    morn: number
  },
  pressure: number,
  humidity: number,
  weather: [
    {
      id: number,
      main: string,
      description: string,
      icon: string
    }
  ],
  speed: number,
  deg: number,
  gust: number,
  clouds: number,
  pop: number,
  rain: number
}