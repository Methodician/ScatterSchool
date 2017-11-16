import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionVoteComponent } from './suggestion-vote.component';

describe('SuggestionVoteComponent', () => {
  let component: SuggestionVoteComponent;
  let fixture: ComponentFixture<SuggestionVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuggestionVoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
