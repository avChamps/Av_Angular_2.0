import { TestBed } from '@angular/core/testing';

import { JobsPortalService } from './jobs-portal.service';

describe('JobsPortalService', () => {
  let service: JobsPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
