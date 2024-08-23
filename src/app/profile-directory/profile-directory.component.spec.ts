import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDirectoryComponent } from './profile-directory.component';

describe('ProfileDirectoryComponent', () => {
  let component: ProfileDirectoryComponent;
  let fixture: ComponentFixture<ProfileDirectoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileDirectoryComponent]
    });
    fixture = TestBed.createComponent(ProfileDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
