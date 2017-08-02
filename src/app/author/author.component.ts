import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { ArticleService } from './../services/article/article.service';
import { UserInfoOpen } from './../services/user/user-info';
import { ArticleDetailOpen } from './../services/article/article-info';
import { FollowUsersComponent } from './../follow-users/follow-users.component';

@Component({
  selector: 'author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})

export class AuthorComponent implements OnInit {

  userInfo: UserInfoOpen;
  usersFollowed: UserInfoOpen[];
  articlesPerAuthor: ArticleDetailOpen[];
  articlesPerEditor: ArticleDetailOpen[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private articleSvc: ArticleService
  ) { }

  ngOnInit() {
    window.scrollTo(0,0)
    this.route.params.subscribe(params => {
      if (params['id']) {
        let userId = params['id'];
        this.getUserInfo(userId);
        this.getArticlesPerAuthor(userId);
        this.getArticlesPerEditor(userId);
        this.getAuthorsFollowed(userId);
      }
    })
  }

  getUserInfo(uid: string) {
    this.userSvc.getUserInfo(uid).subscribe(userInfo =>
      this.userInfo = userInfo
    );
  }

  getAuthorsFollowed(uid: string) {
    this.userSvc.getAuthorsFollowed(uid).subscribe(followed =>
      this.usersFollowed = followed
    );
  }

  getArticlesPerAuthor(uid: string) {
    this.articleSvc.findArticlesPerAuthor(uid).subscribe(articles =>
      this.articlesPerAuthor = articles
    );
  }

  getArticlesPerEditor(uid: string) {
    this.articleSvc.findArticlesPerEditor(uid).subscribe(articles =>
      this.articlesPerEditor = articles
    );
  }

}
