import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'add-suggestion',
  templateUrl: './add-suggestion.component.html',
  styleUrls: ['./add-suggestion.component.scss']
})
export class AddSuggestionComponent {
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      title: '',
      pitch: ''
    });
   }

   saveSuggestion() {
    console.log("title: ", this.form.value.title);
    console.log("pitch: ", this.form.value.pitch);
   }
}
