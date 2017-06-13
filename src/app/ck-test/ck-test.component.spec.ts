import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkTestComponent } from './ck-test.component';

describe('CkTestComponent', () => {
  let component: CkTestComponent;
  let fixture: ComponentFixture<CkTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CkTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
