import { TestBed, inject } from '@angular/core/testing';

import { FirestoreArticleService } from './firestore-article.service';

describe('FirestoreArticleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreArticleService]
    });
  });

  it('should be created', inject([FirestoreArticleService], (service: FirestoreArticleService) => {
    expect(service).toBeTruthy();
  }));
});
