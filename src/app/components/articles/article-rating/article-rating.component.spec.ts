import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleRatingComponent } from './article-rating.component';

describe('ArticleRatingComponent', () => {
  let component: ArticleRatingComponent;
  let fixture: ComponentFixture<ArticleRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
