import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrowDistanceComponent } from './throw-distance.component';

describe('ThrowDistanceComponent', () => {
  let component: ThrowDistanceComponent;
  let fixture: ComponentFixture<ThrowDistanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrowDistanceComponent]
    });
    fixture = TestBed.createComponent(ThrowDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
