import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleRelatedComponent } from './article-related.component';

describe('ArticleRelatedComponent', () => {
  let component: ArticleRelatedComponent;
  let fixture: ComponentFixture<ArticleRelatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleRelatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
