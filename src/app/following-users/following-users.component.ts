import { Component, OnInit, Input } from '@angular/core';
import { UserService } from './../services/user/user.service';
import { UserInfoOpen } from './../services/user/user-info';

@Component({
  selector: 'following-users',
  templateUrl: './following-users.component.html',
  styleUrls: ['./following-users.component.scss']
})
export class FollowingUsersComponent implements OnInit {

  @Input() followingUsers: any;

  constructor(
    private userSvc: UserService
  ) { }

  ngOnInit() {
  }

}
