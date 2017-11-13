import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSearchPreviewComponent } from './article-search-preview.component';

describe('ArticleSearchPreviewComponent', () => {
  let component: ArticleSearchPreviewComponent;
  let fixture: ComponentFixture<ArticleSearchPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleSearchPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSearchPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
