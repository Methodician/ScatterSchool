import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.scss']
})
export class SuggestionFormComponent {

  form: FormGroup;
  
    constructor(fb: FormBuilder) {
      this.form = fb.group({
        title: '',
        pitch: ''
      });
     }

  get value() {
    return this.form.value
  }

}
