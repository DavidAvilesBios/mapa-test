// progress-circle.component.ts

import { HtmlAstPath } from '@angular/compiler';
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss']
})
export class ProgressCircleComponent implements OnInit {

  public percentage: number = 75;

  constructor(private elRef: ElementRef) {
    
  }

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

  createSVG() {
  }
}