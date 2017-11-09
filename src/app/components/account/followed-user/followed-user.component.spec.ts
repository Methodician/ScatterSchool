import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedUserComponent } from './followed-user.component';

describe('FollowedUserComponent', () => {
  let component: FollowedUserComponent;
  let fixture: ComponentFixture<FollowedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
