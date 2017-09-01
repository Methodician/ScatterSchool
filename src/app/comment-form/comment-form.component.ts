import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  @Input() formType;
  form: FormGroup;
  
  constructor(private fb: FormBuilder) {  }

  ngOnInit() {
    console.log('formTypeRendered: ', this.formType);
    
    this.form = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(140)]],
    });
  }

  get text() {
    return this.form.get('text');
  }

  get valid() {
    return this.form.valid
  }

  get value() {
    return this.form.value
  }

}