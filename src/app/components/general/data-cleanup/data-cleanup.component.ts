//import { DataCleanupService } from 'app/shared/services/data-cleanup.service';
import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';
import { AuthService } from 'app/shared/services/auth/auth.service';

@Component({
  selector: 'app-data-cleanup',
  templateUrl: './data-cleanup.component.html',
  styleUrls: ['./data-cleanup.component.scss']
})
export class DataCleanupComponent implements OnInit {

  articles: any;
  authInfo = null;
  userInfo = null;

  constructor(
    private articleSvc: ArticleService,
    userSvc: UserService,
    authSvc: AuthService
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
    userSvc.userInfo$.subscribe(user => {
      this.userInfo = user;
    });
  }
  ngOnInit() {
  }

  copyAllToFirestore() {
    this.articleSvc.getAllArticles().subscribe(articles => {
      this.articles = articles;
      for (let article of this.articles) {
        this.articleSvc.getArticleBodyByKey(article.bodyKey).subscribe(body => {
          article.body = body.$value;
          this.articleSvc.createNewArticleFirestore(this.userInfo, this.authInfo.$uid, article);
        })
      }
    });
  }

}
