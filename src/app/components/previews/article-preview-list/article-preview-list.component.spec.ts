import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePreviewListComponent } from './article-preview-list.component';

describe('ArticlePreviewListComponent', () => {
  let component: ArticlePreviewListComponent;
  let fixture: ComponentFixture<ArticlePreviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlePreviewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePreviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
