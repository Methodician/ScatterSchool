import { AuthService } from 'app/shared/services/auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss', '../post-article/post-article.component.scss']
})

export class EditArticleComponent implements OnInit {
  article: any;
  key: any;
  routeParams: any;
  authInfo = null;

  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    authSvc: AuthService,
    private route: ActivatedRoute
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.key = params['key'];
      this.articleSvc.getArticleByKey(this.key).subscribe(articleToEdit => {
        let articleBodyKey = articleToEdit.bodyKey;
        this.articleSvc.getArticleBodyByKey(articleBodyKey).subscribe(articleBody => {
          articleToEdit.body = articleBody.$value;
          articleToEdit.articleKey = articleToEdit.$key;
          this.article = articleToEdit;
        })
      });
    })
  }

  edit(article) {
    this.articleSvc.updateArticle(this.authInfo.$uid, article)
    this.router.navigate([`articledetail/${article.articleKey}`]);
  }
}
