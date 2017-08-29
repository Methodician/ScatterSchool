import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.scss']
})
export class SuggestionFormComponent implements OnInit {
  
  @Input() initialValue;

  form: FormGroup;
  
  constructor(private fb: FormBuilder) {  }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(140)]],
      pitch: ['', Validators.required]
    });

    this.setInitialValue();
  }

  setInitialValue() {
    if(this.initialValue) {
      this.form.patchValue(this.initialValue)
    }
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

  get pristine() {
    return this.form.pristine;
  }

  get value() {
    return this.form.value
  }
}
