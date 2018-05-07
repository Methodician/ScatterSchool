import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePreviewCardComponent } from './article-preview-card.component';

describe('ArticlePreviewCardComponent', () => {
  let component: ArticlePreviewCardComponent;
  let fixture: ComponentFixture<ArticlePreviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlePreviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
