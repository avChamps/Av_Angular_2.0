import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDelayComponent } from './audio-delay.component';

describe('AudioDelayComponent', () => {
  let component: AudioDelayComponent;
  let fixture: ComponentFixture<AudioDelayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudioDelayComponent]
    });
    fixture = TestBed.createComponent(AudioDelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
