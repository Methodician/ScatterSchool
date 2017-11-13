import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionFormComponent } from './suggestion-form.component';

describe('SuggestionFormComponent', () => {
  let component: SuggestionFormComponent;
  let fixture: ComponentFixture<SuggestionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
