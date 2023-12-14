import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipiosSelectComponent } from './municipios-select.component';

describe('MunicipiosSelectComponent', () => {
  let component: MunicipiosSelectComponent;
  let fixture: ComponentFixture<MunicipiosSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MunicipiosSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipiosSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
