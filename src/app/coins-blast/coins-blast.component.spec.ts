import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsBlastComponent } from './coins-blast.component';

describe('CoinsBlastComponent', () => {
  let component: CoinsBlastComponent;
  let fixture: ComponentFixture<CoinsBlastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoinsBlastComponent]
    });
    fixture = TestBed.createComponent(CoinsBlastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
