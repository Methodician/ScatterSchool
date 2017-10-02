import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleHistoryDetailComponent } from './article-history-detail.component';

describe('ArticleHistoryDetailComponent', () => {
  let component: ArticleHistoryDetailComponent;
  let fixture: ComponentFixture<ArticleHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
