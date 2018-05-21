import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { ArticleService } from 'app/shared/services/article/article.service';
import { ArticleDetailFirestore, ArticleBodyFirestore, ArticleDetailOpen } from 'app/shared/class/article-info';
import { UserService } from 'app/shared/services/user/user.service';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';


@Injectable()
export class DataCleanupService {

  constructor(
    private afdb: AngularFireDatabase,
    private afs: AngularFirestore,
    private articleSvc: ArticleService,
    private userSvc: UserService
  ) { }

  addArticlesPerTag(articleId:string, tagArr){
    tagArr.map(tag => {
      this.afdb
      .object(`articleData/articlesPerTag/${tag}`)
      .update({[articleId]: firebase.database.ServerValue.TIMESTAMP});
  });
  }

  upgradeMainArticleBody(bodyId, articleId, version, lastEditorId) {
    const bodyDoc = this.articleSvc.getArticleBody(bodyId);
    bodyDoc
      .valueChanges()
      .subscribe((depBody: any) => {
        const body = depBody.body.$value;
        const newBody = {
          articleId: articleId,
          body: body,
          nextEditorId: lastEditorId,
          version: version
        };
        bodyDoc.set(newBody);
      });
  }

  addLastEditorToArticle(articleId, lastEditorId) {
    const articleDoc = this.articleSvc.getArticle(articleId);
    articleDoc.update({
      lastEditorId: lastEditorId
    });
  }

  addLastEditorToArchive(articleId, version, lastEditorId) {
    const archiveDoc = this.articleSvc
      .articleHistory(articleId)
      .doc(version);
    archiveDoc.update({
      lastEditorId: lastEditorId
    });
  }


  addArticleHistory(body: any, bodyId: any, history: any, articleId: string) {
    const batch = this.afs.firestore.batch();
    const articleDoc = this.articleSvc.getArticle(articleId);

    const archiveDoc = this.articleSvc
      .articleHistory(articleId)
      .doc(history.version.toString());
    const archiveArticleObject = this.historyObjectFromFBHistory(history, articleId);
    if (!archiveArticleObject.timestamp.getDate()) {
      archiveArticleObject.timestamp = archiveArticleObject.lastUpdated;
    }
    const archiveBodyDoc = this.articleSvc.archivedArticleBody(bodyId);

    const bodyLogObject: any = {
      body: body.body,
      articleId: articleId,
      version: body.version,
      nextEditorId: body.nextEditorKey || archiveArticleObject.authorId
    };
    if (!bodyLogObject.nextEditorId) {
      debugger; // tslint:disable-line
    }

    batch.set(archiveDoc.ref, archiveArticleObject);
    batch.set(archiveBodyDoc.ref, bodyLogObject);
    // batch.set(articleEditorRef, {
    //   editorId: bodyLogObject,
    //   name: editor.displayName()
    // });
    // batch.set(userArticleEditedRef, {
    //   timestamp: this.fsServerTimestamp(),
    //   articleId: articleId
    // });
    // batch.update(articleDoc.ref, updatedArticleObject);

    batch.commit()
      .then(success => {
        console.log('worked for article ' + articleId + ' and body ' + bodyId);
      })
      .catch(err => {
        console.log(`
          There was a problem saving your article.
          Please share a screenshot of the error with the ScatterSchool dev team
          Error: ${err.toString()}
        `);
      });

  }

  historyObjectFromFBHistory(article: any, articleId: string) {
    return {
      authorId: article.authorKey,
      bodyId: article.bodyKey,
      title: article.title,
      introduction: article.introduction,
      lastUpdated: new Date(article.lastUpdated),
      timestamp: new Date(article.timeStamp) || new Date(article.lastUpdated),
      version: article.version,
      commentCount: article.commentCount || 0,
      viewCount: article.viewCount || 0,
      tags: article.tags || [],
      articleId: articleId,
      isFeatured: article.isFeatured || null
    }
  }

  // getBodyLogObjectFirebase(bodyKey) {
  //   return this.db.object(`articleData/articleBodyArchive/${bodyKey}`);
  // }

  // transferFeaturedStatus() {
  //   this.db.list('articleData/featuredArticles').subscribe(keys => {
  //     for (let key of keys) {
  //       const articleDoc = this.afs.doc(`articleData/articles/articles/${key.$key}`);
  //       articleDoc.update({ isFeatured: true });
  //     }
  //   })
  // }

  transferArticleFbToFs(authorId: string, originalArticle: ArticleDetailOpen, body: string, articleId: string) {
    const article: ArticleDetailFirestore = new ArticleDetailFirestore(
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
        const author: UserInfoOpen = info;
        const batch = this.afs.firestore.batch();
        const articleDoc = this.articleSvc.getArticle(articleId);
        this.articleSvc.processGlobalTags(originalArticle.tags, [], articleId);
        const newBodyDoc = this.articleSvc.getArticleBody(article.bodyId);
        const articleEditorRef = this.articleSvc
          .getArticle(articleId)
          .collection('editors')
          .doc(authorId)
          .ref;
        const userArticleEditedRef = this.articleSvc
          .editedArticlesByUser(authorId)
          .doc(articleId)
          .ref;
        const userArticleAuthoredRef = this.articleSvc
          .articlesByAuthor(article.authorId)
          .doc(articleId)
          .ref;
        const updatedArticleObject = this.articleSvc.updateObjectFromArticle(article, articleId, authorId);
        updatedArticleObject.version = originalArticle.version;
        updatedArticleObject.lastUpdated = article.lastUpdated;
        updatedArticleObject.timestamp = article.timestamp;
        updatedArticleObject.bodyId = article.bodyId;

        batch.set(newBodyDoc.ref, { body: article.body });
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
            alert(`
              There was a problem saving your article.
              Please share a screenshot of the error with the ScatterSchool dev team
              Error: ${err.toString()}
            `);
            resolve(err);
          });
      });
    });
  }

  // articleNodeIdToKey() {
  //   return this.db.list('articleData/articles').subscribe(articles => {
  //     for (let article of articles) {
  //       if (article.bodyId) {
  //         article.bodyKey = article.bodyId;
  //         delete (article.bodyId);
  //       }
  //       if (article.authorId) {
  //         article.authorKey = article.authorId;
  //         delete (article.authorId);
  //       }
  //       this.db.object(`articleData/articles/${article.$key}`).set(article);
  //     }
  //   });
  // }
}
