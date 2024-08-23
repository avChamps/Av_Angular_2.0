import { TestBed } from '@angular/core/testing';

import { DownloadreportService } from './downloadreport.service';

describe('DownloadreportService', () => {
  let service: DownloadreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
