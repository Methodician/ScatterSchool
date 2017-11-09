import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPresenceComponent } from './user-presence.component';

describe('UserPresenceComponent', () => {
  let component: UserPresenceComponent;
  let fixture: ComponentFixture<UserPresenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPresenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
