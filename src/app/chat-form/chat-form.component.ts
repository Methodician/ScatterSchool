import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css']
})
export class ChatFormComponent implements OnInit {
  form: FormGroup;
  maxLength: number = 140;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(this.maxLength)]]
    });
  }

  get text() {
    return this.form.value.text;
  }

  get valid() {
    return this.form.valid;
  }

  get value() {
    return this.form.value;
  }
}
