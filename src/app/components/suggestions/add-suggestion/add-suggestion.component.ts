import { SuggestionService } from 'app/shared/services/suggestion/suggestion.service';
import { Component } from '@angular/core';

@Component({
  selector: 'add-suggestion',
  templateUrl: './add-suggestion.component.html',
  styleUrls: ['./add-suggestion.component.scss']
})
export class AddSuggestionComponent {

  constructor(private suggestionSvc: SuggestionService) { }

  saveSuggestion(formData) {
    this.suggestionSvc.saveSuggestion(formData);
  }
}
