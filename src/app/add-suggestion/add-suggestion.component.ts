import { Component } from '@angular/core';

@Component({
  selector: 'add-suggestion',
  templateUrl: './add-suggestion.component.html',
  styleUrls: ['./add-suggestion.component.scss']
})
export class AddSuggestionComponent {

  constructor() {}

   saveSuggestion(formData) {
     console.log('data', formData);
   }
}
