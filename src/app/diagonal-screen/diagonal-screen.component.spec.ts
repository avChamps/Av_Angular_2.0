import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagonalScreenComponent } from './diagonal-screen.component';

describe('DiagonalScreenComponent', () => {
  let component: DiagonalScreenComponent;
  let fixture: ComponentFixture<DiagonalScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagonalScreenComponent]
    });
    fixture = TestBed.createComponent(DiagonalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
