import { Suggestion } from 'app/shared/class/suggestion.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from 'app/shared/services/suggestion/suggestion.service';

@Component({
  selector: 'app-edit-suggestion',
  templateUrl: './edit-suggestion.component.html',
  styleUrls: ['./edit-suggestion.component.scss']
})
export class EditSuggestionComponent implements OnInit {
  suggestion: Suggestion;
  constructor(private route: ActivatedRoute, private suggestionSvc: SuggestionService, ) { }

  ngOnInit() {
    const key = this.route.snapshot.params['key'];
    this.suggestionSvc
      .getSuggestionByKey(key)
      .valueChanges()
      .subscribe(suggestion => {
        this.suggestion = suggestion;
      });
  }

  saveSuggestion(suggestionData) {
    this.suggestionSvc.updateSuggestion(this.suggestion.id, suggestionData);
  }
}
