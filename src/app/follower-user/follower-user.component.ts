import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { UserInfoOpen } from './../services/user/user-info';


@Component({
  selector: 'follower-user',
  templateUrl: './follower-user.component.html',
  styleUrls: ['./follower-user.component.scss']
})
export class FollowerUserComponent implements OnInit {
  @Input() user: any;

  constructor(private userSvc: UserService) { }

  ngOnInit() {
  }

  navigateToProfile() {
    this.userSvc.navigateToProfile(this.user.uid);
  }

}
