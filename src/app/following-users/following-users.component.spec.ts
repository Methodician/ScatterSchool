import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingUsersComponent } from './following-users.component';

describe('FollowingUsersComponent', () => {
  let component: FollowingUsersComponent;
  let fixture: ComponentFixture<FollowingUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
