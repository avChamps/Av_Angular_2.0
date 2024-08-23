import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EkartComponent } from './ekart.component';

describe('EkartComponent', () => {
  let component: EkartComponent;
  let fixture: ComponentFixture<EkartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EkartComponent]
    });
    fixture = TestBed.createComponent(EkartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
