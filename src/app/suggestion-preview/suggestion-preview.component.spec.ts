import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionPreviewComponent } from './suggestion-preview.component';

describe('SuggestionPreviewComponent', () => {
  let component: SuggestionPreviewComponent;
  let fixture: ComponentFixture<SuggestionPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestionPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
