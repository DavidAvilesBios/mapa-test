import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private circumference: number = Math.PI * 2 * 40;

  constructor() { }

  getPieChart(percentage: number):string {

    const calculateDashOffset = (percentage: number) => {
      const percentageDecimal = percentage / 100;
      return this.circumference * (1 - percentageDecimal);
    }

    return `
      <svg height="100" width="100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#ccc"
          stroke-width="10"
        ></circle>
        <circle
          *ngIf="${percentage} > 0"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="${calculateDashOffset(percentage)}"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          [attr.stroke]="color"
          stroke-width="10"
        ></circle>
      </svg>
    `
  }
}
