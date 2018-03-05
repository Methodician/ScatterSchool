// import { DataCleanupService } from 'app/shared/services/data-cleanup.service';
import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { DataCleanupService } from 'app/data-cleanup.service';

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
    private dataSvc: DataCleanupService,
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
  ngOnInit() { }

  upgradeArticleBodyActive() {
    this.articleSvc
      .getAllArticlesFirestore()
      .valueChanges()
      .take(1)
      .subscribe(articles => {
        this.articles = articles;
        for (const article of this.articles) {
          // this.articleSvc.getArticleBodyById(article.bodyId).valueChanges().subscribe((body: any) => {
          //   article.body = body.body.$value;
          // });
          this.dataSvc.upgradeMainArticleBody(article.bodyId, article.articleId, article.version, article.lastEditorId);
        }
      });
  }
  addLastEditorToArticles() {
    this.articleSvc
      .getAllArticlesFirestore()
      .valueChanges()
      .take(1)
      .subscribe(articles => {
        this.articles = articles;
        for (const article of this.articles) {
          this.articleSvc
            .getArchivedArticlesById(article.articleId)
            .valueChanges()
            .subscribe(history => {
              if (history.length > 0) {
                const mainSet = false;
                article.history = history.reverse();
                for (const item of article.history) {
                  this.articleSvc
                    .getArchivedArticleBodyById(item.bodyId)
                    .valueChanges()
                    .subscribe((body: any) => {
                      if (body) {
                        // this.dataSvc.addLastEditorToArchive(article.articleId, item.version.toString(), body.nextEditorId);
                        // if (!mainSet) {
                        //   this.dataSvc.addLastEditorToArticle(article.articleId, body.nextEditorId);
                        // }
                      }
                      // item.body = body;
                      // if (!mainSet) {
                      //   //article.lastEditorId = body.nextEditorId;
                      //   mainSet = true;
                      // }
                      // //item.lastEditorId = body.nextEditorId;
                    });
                }
              } else {
                this.dataSvc.addLastEditorToArticle(article.articleId, article.authorId);
              }
            });
        }
      });
  }

  // transferArticleHistory() {
  //   this.articleSvc.getAllArticles().subscribe(articles => {
  //     this.articles = articles;
  //     for (let article of this.articles) {
  //       this.articleSvc.getArticleHistoryByKey(article.$key).subscribe(history => {
  //         // article.history = history;
  //         if (history) {
  //           for (let item of history) {
  //             this.dataSvc.getBodyLogObjectFirebase(item.bodyKey).subscribe(bodyLog => {
  //               // hist.bodyLog = bodyLog;
  //               this.dataSvc.addArticleHistory(bodyLog, bodyLog.$key, item, article.$key);
  //             })
  //           }
  //         }
  //       });
  //     }
  //   });
  // }

  transferFeaturedStatus() {
    // this.dataSvc.transferFeaturedStatus();
  }
}
