import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreTestingComponent } from './firestore-testing.component';

describe('FirestoreTestingComponent', () => {
  let component: FirestoreTestingComponent;
  let fixture: ComponentFixture<FirestoreTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
