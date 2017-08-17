import { Component, OnInit } from '@angular/core';
import { SuggestionService } from './../services/suggestion/suggestion.service'
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
  providers: [ SuggestionService ]
})

export class SuggestionsComponent implements OnInit {
  suggestions;

  constructor(private suggestionService: SuggestionService) { }

  ngOnInit() {
    this.suggestionService.getAllSuggestions()
      .subscribe(resource => {
        this.suggestions = resource;
      });
  }
}
