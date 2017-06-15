import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestArticleServiceComponent } from './test-article-service.component';

describe('TestArticleServiceComponent', () => {
  let component: TestArticleServiceComponent;
  let fixture: ComponentFixture<TestArticleServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestArticleServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestArticleServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
