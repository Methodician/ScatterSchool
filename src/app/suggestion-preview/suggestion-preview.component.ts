import { Component, OnInit, Input } from '@angular/core';
import { SuggestionService } from './../services/suggestion/suggestion.service'
import { FirebaseListObservable } from 'angularfire2/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion-preview',
  templateUrl: './suggestion-preview.component.html',
  styleUrls: ['./suggestion-preview.component.scss'],
  providers: [ SuggestionService ]
})

export class SuggestionPreviewComponent implements OnInit {
  suggestions: FirebaseListObservable<any[]>;
  
  constructor(private router: Router, private suggestionService: SuggestionService) { }

  ngOnInit() {
    this.suggestions = this.suggestionService.getAllSuggestions();
  }
}

// I left the *ngFor in the div of the suggestion-preview 
// component for now, because it works and I wanted
// to make sure we're on the same page. 