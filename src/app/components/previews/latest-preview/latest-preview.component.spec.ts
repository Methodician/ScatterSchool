import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestPreviewComponent } from './latest-preview.component';

describe('LatestPreviewComponent', () => {
  let component: LatestPreviewComponent;
  let fixture: ComponentFixture<LatestPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
