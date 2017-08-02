import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUsersComponent } from './follow-users.component';

describe('FollowUsersComponent', () => {
  let component: FollowUsersComponent;
  let fixture: ComponentFixture<FollowUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
