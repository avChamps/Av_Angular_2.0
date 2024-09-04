import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessCardComponent } from './bussiness-card.component';

describe('BussinessCardComponent', () => {
  let component: BussinessCardComponent;
  let fixture: ComponentFixture<BussinessCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BussinessCardComponent]
    });
    fixture = TestBed.createComponent(BussinessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
