import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturePreviewComponent } from './feature-preview.component';

describe('FeaturePreviewComponent', () => {
  let component: FeaturePreviewComponent;
  let fixture: ComponentFixture<FeaturePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
