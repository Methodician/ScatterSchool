import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCleanupComponent } from './data-cleanup.component';

describe('DataCleanupComponent', () => {
  let component: DataCleanupComponent;
  let fixture: ComponentFixture<DataCleanupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCleanupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCleanupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
