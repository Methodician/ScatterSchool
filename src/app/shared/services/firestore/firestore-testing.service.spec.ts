import { TestBed, inject } from '@angular/core/testing';

import { FirestoreTestingService } from './firestore-testing.service';

describe('FirestoreTestingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreTestingService]
    });
  });

  it('should be created', inject([FirestoreTestingService], (service: FirestoreTestingService) => {
    expect(service).toBeTruthy();
  }));
});
