import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPortalComponent } from './job-portal.component';

describe('JobPortalComponent', () => {
  let component: JobPortalComponent;
  let fixture: ComponentFixture<JobPortalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobPortalComponent]
    });
    fixture = TestBed.createComponent(JobPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
