import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtuCalculatorComponent } from './btu-calculator.component';

describe('BtuCalculatorComponent', () => {
  let component: BtuCalculatorComponent;
  let fixture: ComponentFixture<BtuCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtuCalculatorComponent]
    });
    fixture = TestBed.createComponent(BtuCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
