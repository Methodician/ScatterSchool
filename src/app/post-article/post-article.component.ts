import { AuthService } from './../services/auth/auth.service';
import { Router } from '@angular/router';
//import { UserService } from './../services/user/user.service';
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

  constructor(
    private articleSvc: ArticleService,
    //private userSvc: UserService,
    private router: Router,
    authSvc: AuthService
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
  }

  ngOnInit() {
  }

  save(form) {
    let articleId = this.articleSvc.createNewArticle(this.authInfo.$uid, form.value);
    this.router.navigate([`articledetail/${articleId}`]);
    /* this.articleSvc.createNewArticle(this.authInfo.$uid, form.value).subscribe(articleId => {
      this.router.navigate([`articledetail/${articleId}`]);
    }); */
  }

}
