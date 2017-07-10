import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {

  ckeditorContent;
  @Input()
  initialValue: any;

  form: FormGroup;

  constructor(
    fb: FormBuilder
  ) {
    this.form = fb.group({
      title: ['', Validators.required],
      introduction: ['', Validators.required],
      body: ['', Validators.required],
      tags: '',
      bodyId: '',
      lastUpdated: 0,
      timeStamp: 0,
      version: 1,
      articleId: ''
    });
    this.ckeditorContent = ``;

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    //  Must make sure form is initalized before checking...
    if (changes['initialValue'] && changes['initialValue'].currentValue) {
      //if (changes['initialValue']) {
      // We have two methods to set a form's value: setValue and patchValue.
      this.form.patchValue(changes['initialValue'].currentValue);
    }

  }

  onReady($event) {
    console.log('CKEditor Ready event:', $event);
  }

  onFocus($event) {
    console.log('CKEditor Focus event:', $event);
  }

  onBlur($event) {
    console.log('CKEditor Blur event:', $event);
  }

  onChange($event) {
    console.log('CKEditor Change event:', $event);
  }


  isErrorVisible(field: string, error: string) {
    let control = this.form.controls[field];
    return control.dirty && control.errors && control.errors[error];
  }

  reset() {
    this.form.reset();
  }

  get valid() {
    return this.form.valid;
  }

  get value() {
    return this.form.value;
  }

}
