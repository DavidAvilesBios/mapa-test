import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import * as L from 'leaflet';
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';

@Injectable({
  providedIn: 'root'
})
export class MapasService {

  private progressComponents: ProgressCircleComponent[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  createProgressComponent(): ProgressCircleComponent {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ProgressCircleComponent);
    const componentRef = factory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    this.progressComponents.push(componentRef.instance);

    return componentRef.instance;
  }

  removeProgressComponent(component: ProgressCircleComponent): void {
    const index = this.progressComponents.indexOf(component);
    if (index !== -1) {
      this.progressComponents.splice(index, 1);
    }
  }


}
