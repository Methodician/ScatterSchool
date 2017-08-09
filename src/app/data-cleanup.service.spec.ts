import { TestBed, inject } from '@angular/core/testing';

import { DataCleanupService } from './data-cleanup.service';

describe('DataCleanupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataCleanupService]
    });
  });

  it('should ...', inject([DataCleanupService], (service: DataCleanupService) => {
    expect(service).toBeTruthy();
  }));
});
