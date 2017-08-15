import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuggestionComponent } from './add-suggestion.component';

describe('AddSuggestionComponent', () => {
  let component: AddSuggestionComponent;
  let fixture: ComponentFixture<AddSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
