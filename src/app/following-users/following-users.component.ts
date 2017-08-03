import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { UserInfoOpen } from './../services/user/user-info';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'following-users',
  templateUrl: './following-users.component.html',
  styleUrls: ['./following-users.component.scss']
})
export class FollowingUsersComponent implements OnInit {

  @Input() followingUsers: any;
  @Input() articleData: any;
  user;
  article;

  constructor(
    private userSvc: UserService,
    private articleSvc: ArticleService
  ) { }

  ngOnInit() {
    this.userSvc.getFollowingUsers(this.followingUsers.uid).subscribe(user => {
     this.user = user;
   });
  }

  followClick() {
    let followId = this.followingUsers.uid;
    this.userSvc.followUser(followId);
    console.log('ts worked!')
  }

}
