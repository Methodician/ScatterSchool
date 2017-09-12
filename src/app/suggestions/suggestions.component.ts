import { Suggestion } from './../services/suggestion/suggestion.model';
import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { SuggestionService } from './../services/suggestion/suggestion.service'
import { FirebaseListObservable } from 'angularfire2/database';
import { SortOptions } from './../pipes/suggestion-sort.pipe';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
  providers: [SuggestionService]
})

export class SuggestionsComponent implements OnInit {
  suggestions: Suggestion[];
  currentUserKey: string;
  currentSortOption: SortOptions = SortOptions.upvotes;
  constructor(private suggestionService: SuggestionService, private authSvc: AuthService) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.authSvc.authInfo$.subscribe(authInfo => {
      this.currentUserKey = (authInfo.$uid) ? authInfo.$uid : null;
    })

    this.suggestionService.getAllSuggestions()
      .subscribe(suggestions => {
        this.suggestions = suggestions;
      });
  }

  isSelected(sortOption: SortOptions) {
    return sortOption === this.currentSortOption;
  }

  sortBy(sortOption: SortOptions) {
    this.currentSortOption = sortOption;
  }
}
