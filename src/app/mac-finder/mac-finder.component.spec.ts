import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacFinderComponent } from './mac-finder.component';

describe('MacFinderComponent', () => {
  let component: MacFinderComponent;
  let fixture: ComponentFixture<MacFinderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MacFinderComponent]
    });
    fixture = TestBed.createComponent(MacFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
