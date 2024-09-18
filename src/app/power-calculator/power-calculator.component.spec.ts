import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerCalculatorComponent } from './power-calculator.component';

describe('PowerCalculatorComponent', () => {
  let component: PowerCalculatorComponent;
  let fixture: ComponentFixture<PowerCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerCalculatorComponent]
    });
    fixture = TestBed.createComponent(PowerCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
