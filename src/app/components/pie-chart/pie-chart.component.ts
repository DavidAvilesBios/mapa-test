import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @ViewChild('svgComponent', { static: false }) progressSvg: ElementRef<SVGSVGElement>;

  public strokeDashArray: string = "";
  public percentage: number = 0;
  public svgWidth: number = 35;  // Default width
  public svgHeight: number = 35; // Default height
  public data: any;

  constructor(private elRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  setPercentage(newPercentage: any): void {
    this.percentage = newPercentage;
    // Lógica adicional si es necesario
  }

  setData(newData: any): void {
    this.data = newData;
  }

  ngOnInit(): void {
    const mapElement = this.elRef.nativeElement.querySelector('#filler');
    const textoElement = this.elRef.nativeElement.querySelector('#texto');

    let value = this.percentage;
    mapElement.getBoundingClientRect();
    this.strokeDashArray = `${(value * 31.4 / 100).toString()} 31.4`;
    textoElement.innerHTML = `${value}%`;
  }

  ngAfterViewInit() {
    // After the view has been initialized, you can access the SVG element
    const svgElement: SVGSVGElement = this.progressSvg.nativeElement;
    // Do something with the SVG element, if needed
  }

  getSvgElement(): SVGSVGElement {
    return this.progressSvg.nativeElement;
  }
}
