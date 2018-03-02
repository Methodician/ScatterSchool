import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/shared/services/user/user.service';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { ArticleDetailOpen } from 'app/shared/class/article-info';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  userInfo: UserInfoOpen;
  usersFollowed: UserInfoOpen[];
  followersOfUser: UserInfoOpen[];
  articlesAuthored: ArticleDetailOpen[];
  articlesEdited: ArticleDetailOpen[];
  profileImageUrl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private articleSvc: ArticleService,
    private uploadSvc: UploadService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.params.subscribe(params => {
      if (params['key']) {
        let uid = params['key'];
        this.getUserInfo(uid);
        this.getArticlesPerAuthor(uid);
        this.getArticlesPerEditor(uid);
        this.getUsersFollowed(uid);
        this.getFollowersOfUser(uid);
        this.getProfileImage(uid);
      }
    })
  }

  getUserInfo(uid: string) {
    this.userSvc.getUserInfo(uid).subscribe(userInfo => {
      this.userInfo = userInfo;
    });
  }

  getUsersFollowed(uid: string) {
    this.userSvc.getUsersFollowed(uid).subscribe(followed => {
      this.usersFollowed = followed;
    });
  }

  getFollowersOfUser(uid: string) {
    this.userSvc.getFollowersOfUser(uid).subscribe(following => {
      this.followersOfUser = following;
    });
  }

  getArticlesPerAuthor(uid: string) {
    this.articleSvc
      .getArticlesAuthoredByUid(uid)
      .valueChanges()
      .subscribe(articles =>
        this.articlesAuthored = articles as ArticleDetailOpen[]
      );
  }

  getArticlesPerEditor(uid: string) {
    this.articleSvc
    .getArticlesAuthoredByUid(uid)
    .valueChanges()
    .subscribe(articles =>
      this.articlesEdited = articles as ArticleDetailOpen[]
    );
  }

  // followClick() {
  //   let followId = this.userInfo.uid;
  //   this.userSvc.followUser(followId);
  //   console.log('ts worked!')
  // }

  getProfileImage(uid) {
    const basePath = 'uploads/profileImages/';
    this.uploadSvc.getImage(uid, basePath).subscribe(profileData => {
      if (profileData.url) {
        this.profileImageUrl = profileData.url;
      }
    });
  }
}
