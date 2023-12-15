import * as L from 'leaflet';

export type CloudLayer = {
  tiempoUnix: number;
  capaMapa?: L.Layer;
}