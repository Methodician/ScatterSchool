import { Component, OnInit, Input } from '@angular/core';
import { UserService } from './../services/user/user.service';
import { UserInfoOpen } from './../services/user/user-info';

@Component({
  selector: 'follow-users',
  templateUrl: './follow-users.component.html',
  styleUrls: ['./follow-users.component.scss']
})
export class FollowUsersComponent implements OnInit {

  @Input() usersFollowed: any;

  constructor(
    private userSvc: UserService
  ) { }

  ngOnInit() {
  }

}
