import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { ArticleService } from './../services/article/article.service';
import { UserInfoOpen } from './../services/user/user-info';
import { ArticleDetailOpen } from './../services/article/article-info';

@Component({
  selector: 'author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})

export class AuthorComponent implements OnInit {

  userInfo: UserInfoOpen;
  articlesPerAuthor: ArticleDetailOpen[];
  articlesPerEditor: ArticleDetailOpen[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private articleSvc: ArticleService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        let userId = params['id'];
        this.getUserInfo(userId);
        this.getArticlesPerAuthor(userId);
        this.getArticlesPerEditor(userId);
      }
    })
  }

  getUserInfo(uid: string) {
    this.userSvc.getUserInfo(uid).subscribe(userInfo => {
      this.userInfo = userInfo;
    })
  }

  getArticlesPerAuthor(uid: string) {
    this.articleSvc.findArticlesPerAuthor(uid).subscribe(articles => this.articlesPerAuthor = articles);
  }

  getArticlesPerEditor(uid: string) {
    this.articleSvc.findArticlesPerEditor(uid).subscribe(articles => this.articlesPerEditor = articles);
  }

}
