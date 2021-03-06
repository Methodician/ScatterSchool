import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit, OnChanges {
  @Input() initialValue: any;
  ckeditorContent = '';
  titleError: string;
  form: FormGroup;
  formTags = [];
  articleTags = [];
  validator = [this.tagValidation]

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['',
        [Validators.required, Validators.maxLength(100)]
      ],
      introduction: ['', Validators.required],
      body: ['', Validators.required],
      tags: [[]],
      bodyId: '',
      lastUpdated: null,
      timestamp: null,
      version: 1,
      articleId: '',
      authorId: '',
      lastEditorId: '',
      commentCount: 0,
      viewCount: 0,
      isFeatured: false
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    //  Must make sure form is initalized before checking...
    if (changes['initialValue'] && changes['initialValue'].currentValue) {
      // console.log(changes);
      // We have two methods to set a form's value: setValue and patchValue.
      this.form.patchValue(changes['initialValue'].currentValue);
      this.initializeTags(changes['initialValue'].currentValue.tags);
    }
  }

  initializeTags(articleTags) {
    if (articleTags) {
      this.articleTags = articleTags;
      for (const tag of articleTags) {
        this.formTags.push({ 'display': tag, 'value': tag });
      }
    }
  }

  tagValidation(control: FormControl) {
    // regex that allows only alpnanumeric characters and spaces
    const tag = control.value,
      regexp = new RegExp('^[a-zA-Z0-9 ]*$'),
      test = regexp.test(tag);
    return test ? null : { 'alphanumericCheck': true }
  }

  onTagAdded($event) {
    this.articleTags.push($event.value.toUpperCase());
    this.form.controls.tags.patchValue(this.articleTags);
    // this.form.controls.tags.setValue(this.articleTags);
    // this.form.title[upperTag] = true;
  }

  onTagRemoved($event) {
    // console.log($event);
    const tagToRemove = $event.value.toUpperCase();
    this.removeTag(tagToRemove);
    this.form.controls.tags.patchValue(this.articleTags);
  }

  removeTag(tag) {
    const arteTags = this.articleTags;
    let index = arteTags.indexOf(tag);

    while (index !== -1) {
      arteTags.splice(index, 1);
      index = arteTags.indexOf(tag);
    }
  }

  isErrorVisible(field: string, error: string) {
    const control = this.form.controls[field];
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

  get tags() {
    return this.articleTags;
  }
}
