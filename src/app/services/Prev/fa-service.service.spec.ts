import { TestBed } from '@angular/core/testing';

import { FaServiceService } from './fa-service.service';

describe('FaServiceService', () => {
  let service: FaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
