import { AuthService } from 'app/shared/services/auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { ArticleDetailFirestore } from 'app/shared/class/article-info';
import { DEFAULT_RESIZE_TIME } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss', '../post-article/post-article.component.scss']
})

export class EditArticleComponent implements OnInit {
  article: any;
  // previewArticle: any;
  articleId: any;
  routeParams: any;
  authInfo = null;
  userInfo = null;
  isShowingPreview = false;

  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    authSvc: AuthService,
    userSvc: UserService,
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
    userSvc.userInfo$.subscribe(user => {
      this.userInfo = user;
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.params.subscribe(params => {
      this.articleId = params['key'];

      //  Firestore way:
      this.articleSvc
        .getArticle(this.articleId)
        .valueChanges()
        .subscribe((articleToEdit: ArticleDetailFirestore) => {
          this.articleSvc
            .getArticleBody(articleToEdit.bodyId)
            .valueChanges()
            .subscribe(articleBody => {
              if (articleBody) {
                articleToEdit.body = articleBody.body;
                this.article = articleToEdit;
              }
            });
        });
    })
    //  Firestore version:
    // this.route.params.subscribe(params => {
    //   this.key = params['key'];
    //   this.fsArticleSvc.getArticle(this.key).valueChanges()
    //     .subscribe((articleToEdit: ArticleDetailFirestore) => {
    //       let articleBodyId = articleToEdit.bodyId;
    //       this.fsArticleSvc.getArticleBody(articleBodyId).valueChanges()
    //         .subscribe((articleBody: ArticleBodyFirestore) => {
    //           articleToEdit.body = articleBody.body;
    //           articleToEdit.articleId = this.key;
    //           this.article = articleToEdit;
    //         });
    //     });
  }

  nextClicked() {
    this.isShowingPreview = true;
    window.scrollTo(0, 0)
  }

  backClicked() {
    this.isShowingPreview = false;
    window.scrollTo(0, 0)
  }

  cancelClicked() {
    this.router.navigate([`articledetail/${this.articleId}`]);
  }

  async edit(article) {
    try {
      const res = this.articleSvc.updateArticle(this.authInfo.$uid, this.userInfo, article, this.articleId);
      if (res) {
        this.router.navigate([`articledetail/${article.articleId}`]);
      } else {
        alert('trouble editing the article' + res);
      }
    } catch (err) {
      console.log(err);
    }

    // this.articleSvc.updateArticle(this.authInfo.$uid, this.userInfo, article, this.key)
    //   .then(res => {
    //     if (res)
    //       this.router.navigate([`articledetail/${article.articleId}`]);
    //     else alert('trouble editing the article' + res);
    //   })
    //   .catch(err => console.log(err));
    // this.articleSvc.updateArticle(this.authInfo.$uid, article)
    // this.router.navigate([`articledetail/${article.articleId}`]);
  }
}
