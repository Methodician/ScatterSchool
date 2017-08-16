import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.scss']
})
export class SuggestionFormComponent {

  form: FormGroup;
  
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      title: ['', [Validators.required, Validators.maxLength(140)]],
      pitch: ['', Validators.required]
    });
  }

  get title() {
    return this.form.get('title');
  }

  get pitch() {
    return this.form.get('pitch');
  }

  get valid() {
    return this.form.valid
  }

  get value() {
    return this.form.value
  }
}
