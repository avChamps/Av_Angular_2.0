import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvRackComponent } from './av-rack.component';

describe('AvRackComponent', () => {
  let component: AvRackComponent;
  let fixture: ComponentFixture<AvRackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvRackComponent]
    });
    fixture = TestBed.createComponent(AvRackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
