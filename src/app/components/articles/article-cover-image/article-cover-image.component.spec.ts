import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCoverImageComponent } from './article-cover-image.component';

describe('ArticleCoverImageComponent', () => {
  let component: ArticleCoverImageComponent;
  let fixture: ComponentFixture<ArticleCoverImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleCoverImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCoverImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
