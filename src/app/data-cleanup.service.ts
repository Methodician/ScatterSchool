import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { ArticleService } from 'app/shared/services/article/article.service';
import { ArticleDetailFirestore, ArticleBodyFirestore, ArticleDetailOpen } from 'app/shared/class/article-info';
import { UserService } from 'app/shared/services/user/user.service';


@Injectable()
export class DataCleanupService {

  constructor(
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private articleSvc: ArticleService,
    private userSvc: UserService
  ) { }

  createArticleFbToFs(authorId: string, article: any) {
    this.userSvc.getUserInfo(authorId).subscribe(info => {
      let user: UserInfoOpen = info;
      let batch = this.afs.firestore.batch();
      let newArticle: any = this.articleSvc.newObjectFromArticle(article, authorId);

      //  Attempting to refactor in atomic way:
      const bodyId = this.afs.createId();
      newArticle.bodyId = bodyId;
      const articleId = this.afs.createId();

      const bodyRef = this.articleSvc.getArticleBodyById(bodyId).ref;
      batch.set(bodyRef, { body: article.body });

      const articleRef = this.articleSvc.getArticleById(articleId).ref;
      batch.set(articleRef, newArticle);

      const articleEditorRef = this.articleSvc.getArticleById(articleId).collection('editors').doc(authorId).ref;
      batch.set(articleEditorRef, {
        editorId: authorId,
        name: user.alias || user.fName
      });

      const userArticleEditedRef = this.articleSvc.getArticlesEditedByUid(authorId).doc(articleId).ref;
      batch.set(userArticleEditedRef, {
        timestamp: this.articleSvc.fsServerTimestamp(),
        articleId: articleId
      });

      const userArticleAuthoredRef = this.articleSvc.getArticlesAuthoredByUid(authorId).doc(articleId).ref;
      batch.set(userArticleAuthoredRef, {
        timestamp: this.articleSvc.fsServerTimestamp(),
        articleId: articleId
      });

      for (let tag of article.tags) {
        this.articleSvc.addGlobalTagFirestore(tag);
      }

      return batch.commit()
        .then(success => {
          return articleId;
        })
        .catch(err => {
          alert('There was a problem saving your article. Please share a screenshot of the error with the ScatterSchool dev. team' + err.toString());
        });
    });
  }

  transferArticleFbToFs(authorId: string, originalArticle: ArticleDetailOpen, body: string, articleId: string) {
    let article: ArticleDetailFirestore = new ArticleDetailFirestore(
      originalArticle.authorKey,
      originalArticle.bodyKey,
      originalArticle.title,
      originalArticle.introduction,
      new Date(originalArticle.lastUpdated),
      new Date(originalArticle.timeStamp),
      originalArticle.version,
      0,
      0,
      originalArticle.tags,
      body
    );
    return new Promise(resolve => {
      this.userSvc.getUserInfo(authorId).subscribe(info => {
        let author: UserInfoOpen = info;
        let batch = this.afs.firestore.batch();
        const articleDoc = this.articleSvc.getArticleById(articleId);

        // articleDoc.valueChanges().first()
        // .subscribe((oldArticle: ArticleDetailFirestore) => {
        //  Would like to make global tags processing atomic as well.
        this.articleSvc.processGlobalTags(originalArticle.tags, [], articleId);
        //const archiveDoc = this.articleSvc.getArchivedArticlesById(articleId).doc(oldArticle.version.toString());
        //const archiveArticleObject = this.articleSvc.updateObjectFromArticle(oldArticle, articleId);
        //const currentBodyDoc = this.articleSvc.getArticleBodyById(oldArticle.bodyId);
        //const newBodyId = this.afs.createId();
        const newBodyDoc = this.articleSvc.getArticleBodyById(article.bodyId);
        //const archiveBodyDoc = this.articleSvc.getArchivedArticleBodyById(oldArticle.bodyId);
        const articleEditorRef = this.articleSvc.getArticleById(articleId).collection('editors').doc(authorId).ref;
        const userArticleEditedRef = this.articleSvc.getArticlesEditedByUid(authorId).doc(articleId).ref;
        const userArticleAuthoredRef = this.articleSvc.getArticlesAuthoredByUid(article.authorId).doc(articleId).ref;
        let updatedArticleObject: any = this.articleSvc.updateObjectFromArticle(article, articleId);
        updatedArticleObject.version = originalArticle.version;
        updatedArticleObject.lastUpdated = article.lastUpdated;
        updatedArticleObject.timestamp = article.timestamp;
        updatedArticleObject.bodyId = article.bodyId;

        // currentBodyDoc.valueChanges().first()
        // .subscribe((body: ArticleBodyFirestore) => {
        // const bodyLogObject: any = {
        //   body: body.body,
        //   articleId: articleId,
        //   version: oldArticle.version,
        //   nextEditorId: editorId
        // };

        // batch.set(archiveDoc.ref, archiveArticleObject);
        // batch.set(archiveBodyDoc.ref, bodyLogObject);
        batch.set(newBodyDoc.ref, { body: article.body });
        // batch.delete(currentBodyDoc.ref);
        batch.set(articleEditorRef, {
          editorId: authorId,
          name: author.alias || author.fName
        });
        batch.set(userArticleEditedRef, {
          timestamp: article.lastUpdated,
          articleId: articleId
        });
        batch.set(userArticleAuthoredRef, {
          timestamp: article.timestamp,
          articleId: articleId
        });
        batch.set(articleDoc.ref, updatedArticleObject);

        batch.commit()
          .then(success => {
            resolve(true);
          })
          .catch(err => {
            alert('There was a problem saving your originalArticle. Please share a screenshot of the error with the ScatterSchool dev. team' + err.toString());
            resolve(err);
          });
        // });

      });
    });

    // });
  }

  articleNodeIdToKey() {
    return this.db.list('articleData/articles').subscribe(articles => {
      for (let article of articles) {
        //console.log(article);
        if (article.bodyId) {
          article.bodyKey = article.bodyId;
          delete (article.bodyId);

        }
        if (article.authorId) {
          article.authorKey = article.authorId;
          delete (article.authorId);
        }

        //console.log(article);
        this.db.object(`articleData/articles/${article.$key}`).set(article);
      }
    });
  }


}
