import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-card-information',
  templateUrl: './card-information.component.html',
  styleUrls: ['./card-information.component.scss']
})
export class CardInformationComponent implements OnInit, OnChanges {
  @Input() properties?: any;

  //Layout
  public showCarousel: boolean;
  public imageIndex: number;
  public currentDate: Date = new Date();

  //Gallery
  public responsiveOptions: any[];
  public displayCustom: boolean;
  public activeIndex: number;
  public images: any[];

  constructor() {
    this.showCarousel = false;
    this.imageIndex = 0;
    this.activeIndex = 0;
    this.displayCustom = false;
    this.images = [];

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnChanges() {

  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.properties.llenano = this.properties.llenano.toFixed(2)
  }





}
