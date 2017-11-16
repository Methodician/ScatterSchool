import { TestBed, inject } from '@angular/core/testing';

import { SuggestionService } from './suggestion.service';

describe('SuggestionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuggestionService]
    });
  });

  it('should ...', inject([SuggestionService], (service: SuggestionService) => {
    expect(service).toBeTruthy();
  }));
});
