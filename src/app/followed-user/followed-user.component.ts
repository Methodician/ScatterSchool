// NOTE: This component is currently unused. The follower-user component handles displaing information for both followed users and follower users
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { UserInfoOpen } from './../services/user/user-info';

@Component({
  selector: 'followed-user',
  templateUrl: './followed-user.component.html',
  styleUrls: ['./followed-user.component.scss']
})
export class FollowedUserComponent implements OnInit {
  @Input() user: any;

  constructor(private userSvc: UserService) { }

  ngOnInit() {}

  navigateToProfile() {
    this.userSvc.navigateToProfile(this.user.uid);
  }

}
