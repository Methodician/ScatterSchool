import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { UserInfoOpen } from './../services/user/user-info';
import { ArticleService } from './../services/article/article.service';


@Component({
  selector: 'follow-users',
  templateUrl: './follow-users.component.html',
  styleUrls: ['./follow-users.component.scss']
})
export class FollowUsersComponent implements OnInit {

  @Input() usersFollowed: any;
  @Input() articleData: any;
  user;
  article;

  constructor(
    private userSvc: UserService,
    private articleSvc: ArticleService,
  ) { }

  ngOnInit() {
    this.userSvc.getAuthorsFollowed(this.usersFollowed.uid).subscribe(user => {
     this.user = user;
   });
  }

  navigateToUser() {
    this.userSvc.navigateToUser(this.usersFollowed.uid);
  }

  followClick() {
    let followId = this.usersFollowed.uid;
    this.userSvc.followUser(followId);
    console.log('ts worked!')
  }

}
