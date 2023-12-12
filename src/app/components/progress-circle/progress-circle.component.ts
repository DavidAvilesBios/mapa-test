// progress-circle.component.ts

import { HtmlAstPath } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss']
})
export class ProgressCircleComponent implements OnInit {
  @ViewChild('progressSvg', { static: false }) progressSvg: ElementRef<SVGSVGElement>;

  public percentage: number = 75;
  public svgWidth: number = 30;  // Default width
  public svgHeight: number = 30; // Default height

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    const mapElement = this.elRef.nativeElement.querySelector('#meter');
    const progressBarElement = this.elRef.nativeElement.querySelector('#progressBar');

    let length = mapElement.getTotalLength();
    let value = this.percentage;
    let to = length * ((100 - value) / 100);
    mapElement.getBoundingClientRect();
    mapElement.style.strokeDashoffset = (Math.max(0, to)).toString();
    mapElement.nextElementSibling.textContent = `${value}%`;
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