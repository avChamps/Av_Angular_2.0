import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandwidthCalculatorComponent } from './bandwidth-calculator.component';

describe('BandwidthCalculatorComponent', () => {
  let component: BandwidthCalculatorComponent;
  let fixture: ComponentFixture<BandwidthCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BandwidthCalculatorComponent]
    });
    fixture = TestBed.createComponent(BandwidthCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
