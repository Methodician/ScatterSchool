import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSearchResultsComponent } from './article-search-results.component';

describe('ArticleSearchResultsComponent', () => {
  let component: ArticleSearchResultsComponent;
  let fixture: ComponentFixture<ArticleSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
