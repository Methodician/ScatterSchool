import { SuggestionService } from './../services/suggestion/suggestion.service';
import { Component } from '@angular/core';

@Component({
  selector: 'add-suggestion',
  templateUrl: './add-suggestion.component.html',
  styleUrls: ['./add-suggestion.component.scss']
})
export class AddSuggestionComponent {

  constructor(private service: SuggestionService) {}

   saveSuggestion(formData) {
     this.service.saveSuggestion(formData);
   }
}
