import { AuthService } from 'app/shared/services/auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';

import { Component, Input, OnInit } from '@angular/core';
import { FirestoreArticleService } from 'app/shared/services/article/firestore-article.service';
import { ArticleDetailFirestore, ArticleBodyFirestore } from 'app/shared/class/article-info';
import { UserService } from 'app/shared/services/user/user.service';

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
  userInfo = null;

  constructor(
    private articleSvc: ArticleService,
    private fsArticleSvc: FirestoreArticleService,
    private router: Router,
    authSvc: AuthService,
    userSvc: UserService,
    private route: ActivatedRoute,
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
    userSvc.userInfo$.subscribe(user => {
      this.userInfo = user;
    })
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.params.subscribe(params => {
      this.key = params['key'];
      this.fsArticleSvc.getArticleById(this.key).valueChanges()
        .subscribe((articleToEdit: ArticleDetailFirestore) => {
          let articleBodyId = articleToEdit.bodyId;
          this.fsArticleSvc.getArticleBodyById(articleBodyId).valueChanges()
            .subscribe((articleBody: ArticleBodyFirestore) => {
              articleToEdit.body = articleBody.body;
              articleToEdit.articleId = this.key;
              this.article = articleToEdit;
            });
        });
      // this.articleSvc.getArticleByKey(this.key).subscribe(articleToEdit => {
      //   let articleBodyKey = articleToEdit.bodyKey;
      //   this.articleSvc.getArticleBodyByKey(articleBodyKey).subscribe(articleBody => {
      //     articleToEdit.body = articleBody.$value;
      //     articleToEdit.articleKey = articleToEdit.$key;
      //     this.article = articleToEdit;
      //   })
      // });
    })
  }

  edit(article) {
    this.fsArticleSvc.updateArticle(this.authInfo.$uid, this.userInfo, article, this.key)
      .then(res => {
        if (res)
          this.router.navigate([`articledetail/${article.articleId}`]);
        else alert('trouble editing the article');
      })
      .catch(err => alert('trouble editing the article' + err));
    // .then(
    //   this.router.navigate([`articledetail/${article.articleId}`]);
    // ).catch(err => alert('trouble editing the article' + err));
    // this.articleSvc.updateArticle(this.authInfo.$uid, article)
    // this.router.navigate([`articledetail/${article.articleKey}`]);
  }
}
