import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorArticlePreviewComponent } from './author-article-preview.component';

describe('AuthorArticlePreviewComponent', () => {
  let component: AuthorArticlePreviewComponent;
  let fixture: ComponentFixture<AuthorArticlePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorArticlePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorArticlePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
