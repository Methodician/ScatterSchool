import { UploadService } from 'app/services/upload/upload.service';
import { AuthService } from './../services/auth/auth.service';
import { Router } from '@angular/router';
import { ArticleService } from './../services/article/article.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-article',
  templateUrl: './post-article.component.html',
  styleUrls: ['./post-article.component.css']
})
export class PostArticleComponent implements OnInit {
  authInfo = null;
  article: any;
  reservedArticleKey;

  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    authSvc: AuthService
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.reservedArticleKey = this.articleSvc.reserveArticleKey();
  }

  save(article) {
    const articleId = this.articleSvc.createNewArticle(this.authInfo.$uid, article)
    this.router.navigate([`articledetail/${articleId}`]);
  }
}
