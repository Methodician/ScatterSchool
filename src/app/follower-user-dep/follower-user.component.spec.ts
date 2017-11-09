import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerUserComponent } from './follower-user.component';

describe('FollowerUserComponent', () => {
  let component: FollowerUserComponent;
  let fixture: ComponentFixture<FollowerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
