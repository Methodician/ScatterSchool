import { TestBed, inject } from '@angular/core/testing';

import { ArticleCoverImgUploadService } from './article-cover-img-upload.service';

describe('ArticleCoverImgUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleCoverImgUploadService]
    });
  });

  it('should ...', inject([ArticleCoverImgUploadService], (service: ArticleCoverImgUploadService) => {
    expect(service).toBeTruthy();
  }));
});
