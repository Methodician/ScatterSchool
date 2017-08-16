import { Component, OnInit } from '@angular/core';
import { SuggestionService } from './../services/suggestion/suggestion.service'
import { FirebaseListObservable } from 'angularfire2/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
  providers: [ SuggestionService ]
})

export class SuggestionsComponent implements OnInit {
  suggestions: FirebaseListObservable<any[]>;
  constructor(private router: Router, private suggestionService: SuggestionService) { }

  ngOnInit() {
    this.suggestions = this.suggestionService.getAllSuggestions();
  }
}
