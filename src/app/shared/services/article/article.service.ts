import { ArticleDetailOpen, GlobalTag, ArticleDetailFirestore, ArticleBodyFirestore } from 'app/shared/class/article-info';
import { Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { error } from 'util';

@Injectable()
export class ArticleService {
  globalTags: Iterable<GlobalTag>;
  constructor(
    private rtdb: AngularFireDatabase,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.primeTags();
  }

  getGlobalTags() {
    return this.afs.doc('articleData/tags');
  }

  getAllArticlesFirestore() {
    return this.afs
      .collection('articleData')
      .doc('articles')
      .collection('articles');
  }

  getLatestArticles() {
    return this.afs
    .collection('articleData')
    .doc('articles')
    .collection('articles', ref => {
      return ref
        .orderBy('timestamp', 'desc')
        .limit(12);
    });
  }

  getFeaturedArticles() {
    return this.afs
      .collection('articleData')
      .doc('articles')
      .collection('articles', ref => {
        return ref.where('isFeatured', '==', true)
      });
  }

  getArticleById(articleId: string) {
    return this.afs.doc(`articleData/articles/articles/${articleId}`);
  }

  getArticleBodyById(bodyId: string): AngularFirestoreDocument<ArticleBodyFirestore> {
    return this.afs.doc(`articleData/bodies/active/${bodyId}`);
  }

  // SUGGESTION: archivedArticleBody(bodyId: string) is as self explanatory
  getArchivedArticleBodyById(bodyId: string) {
    return this.afs.doc(`articleData/bodies/history/${bodyId}`);
  }

  getArchivedArticlesById(articleId: string) {
    return this
      .getArticleById(articleId)
      .collection('history', ref => {
        return ref.orderBy('version');
      });
  }

  getArticlesEditedByUid(userId: string) {
    return this.afs
      .collection('userData')
      .doc(userId)
      .collection('articlesEdited');
  }

  getArticlesAuthoredByUid(userId: string) {
    return this.afs
      .collection('userData')
      .doc(userId)
      .collection('articlesAuthored');
  }

  async createNewArticle(author: UserInfoOpen, authorId: string, article: any) {
    const articleId = await this.createNewArticleFirestore(author, authorId, article);
    return articleId;
  }

  async createNewArticleFirestore(author: UserInfoOpen, authorId: string, article: any) {
    const batch = this.afs.firestore.batch();
    const newArticle: any = this.newObjectFromArticle(article, authorId);

    const bodyId = this.afs.createId();
    newArticle.bodyId = bodyId;
    const articleId = this.afs.createId();
    newArticle.articleId = articleId;
    const bodyRef = this.getArticleBodyById(bodyId).ref;
    const newBody = this.dbObjectFromBody(article.body, articleId, 1, authorId);
    batch.set(bodyRef, newBody);

    const articleRef = this.getArticleById(articleId).ref;
    batch.set(articleRef, newArticle);

    const articleEditorRef = this
      .getArticleById(articleId)
      .collection('editors')
      .doc(authorId)
      .ref;
    batch.set(articleEditorRef, {
      editorId: authorId,
      name: author.displayName()
    });

    const userArticleEditedRef = this
      .getArticlesEditedByUid(authorId)
      .doc(articleId)
      .ref;
    batch.set(userArticleEditedRef, {
      timestamp: this.fsServerTimestamp(),
      articleId: articleId
    });

    const userArticleAuthoredRef = this
      .getArticlesAuthoredByUid(authorId)
      .doc(articleId)
      .ref;
    batch.set(userArticleAuthoredRef, {
      timestamp: this.fsServerTimestamp(),
      articleId: articleId
    });

    for (const tag of article.tags) {
      this.addGlobalTagFirestore(tag);
    }

    try {
      await batch.commit();
      return articleId;
    } catch (err) {
      alert(`
        There was a problem saving your article.
        Please share a screenshot of the error with the ScatterSchool dev. team
        Error: ${err.toString()}
      `);
      return err.toString();
    }
  }

  // candidate for refactor
  // method passes data directly to similarly named method
  updateArticle(editorId: string, editor: UserInfoOpen, article: ArticleDetailFirestore, articleId: string) {
    return this.updateArticleFirestore(editorId, editor, article, articleId);
  }

  updateArticleFirestore(editorId: string, editor: UserInfoOpen, article: ArticleDetailFirestore, articleId: string) {
    return new Promise(resolve => {
      const batch = this.afs.firestore.batch();
      //  Wondering if we should stop using this and just get the lastest from history...
      const articleDoc = this.getArticleById(articleId);

      articleDoc.valueChanges().first()
        .subscribe((oldArticle: ArticleDetailFirestore) => {
          const newBodyId = this.afs.createId();
          const archiveArticleObject = this.updateObjectFromArticle(oldArticle, articleId, oldArticle.lastEditorId);
          const updatedArticleObject: any = this.updateObjectFromArticle(article, articleId, editorId);
          updatedArticleObject.version = article.version + 1;
          updatedArticleObject.lastUpdated = this.fsServerTimestamp();
          updatedArticleObject.bodyId = newBodyId;
          //  Would like to make global tags processing atomic as well.
          this.processGlobalTags(article.tags, oldArticle.tags, articleId);
          const archiveDoc = this.getArchivedArticlesById(articleId).doc(oldArticle.version.toString());
          const currentDoc = this.getArchivedArticlesById(articleId).doc(updatedArticleObject.version.toString());
          const currentBodyDoc = this.getArticleBodyById(oldArticle.bodyId);
          const newBodyDoc = this.getArticleBodyById(newBodyId);
          const archiveBodyDoc = this.getArchivedArticleBodyById(oldArticle.bodyId);
          const articleEditorRef = this.getArticleById(articleId).collection('editors').doc(editorId).ref;
          const userArticleEditedRef = this.getArticlesEditedByUid(editorId).doc(articleId).ref;


          currentBodyDoc.valueChanges().first()
            .subscribe(async (body: ArticleBodyFirestore) => {
              const bodyLogObject: any = this.dbObjectFromBody(body.body, articleId, oldArticle.version, oldArticle.lastEditorId);
              const newBodyObject: any = this.dbObjectFromBody(article.body, articleId, updatedArticleObject.version, editorId);
              batch.set(archiveDoc.ref, archiveArticleObject);
              batch.set(archiveBodyDoc.ref, bodyLogObject);
              batch.set(newBodyDoc.ref, newBodyObject);
              batch.delete(currentBodyDoc.ref);
              //  Maybe these associations belong in cloud functions...
              batch.set(articleEditorRef, {
                editorId: editorId,
                name: editor.displayName()
              });
              batch.set(userArticleEditedRef, {
                timestamp: this.fsServerTimestamp(),
                articleId: articleId
              });
              //  Maybe history duplications belong in could functions...
              batch.set(currentDoc.ref, updatedArticleObject);
              batch.update(articleDoc.ref, updatedArticleObject);

              try {
                await batch.commit();
                resolve(true);
              } catch (err) {
                if (err.code === 'permission-denied') {
                  alert(`
                    There was a problem saving your article related to access permissions.
                    If that doesn\'t sound quite right, please submit a bug report to the ScatterSchool github page
                    or just share a screenshot of this message with the dev team at https://flight.run. Thanks!
                    Error: ${err}
                  `);
                  resolve(err);
                } else {
                  alert(`
                    There was a problem saving your article.
                    Please share a screenshot of the error with the ScatterSchool dev. team.
                    Error: ${err.toString()}
                  `);
                  resolve(err);
                }
              }
              // batch.commit()
              //   .then(success => {
              //     resolve(true);
              //   })
              //   .catch(err => {
              //     if (err.code == 'permission-denied') {
              //       alert(`
              //         There was a problem saving your article related to access permissions.
              //         If that doesn\'t sound quite right, please submit a bug report to the ScatterSchool github page
              //         or just share a screenshot of this message with the dev team at https://flight.run.
              //         Thanks! Error: ${err.toString()}
              //       `);
              //       resolve(err);
              //     }
              //     else {
              //       alert(`
              //         There was a problem saving your article.
              //         Please share a screenshot of the error with the ScatterSchool dev. team.
              //         Error: ${err.toString()}
              //      `);
              //       resolve(err);
              //     }
              //   });
            });

        });
    });
  }

  // candidate for refactor
  // confusing/verbose validation of parameters
  tagsArrayFromTagsObject(articleTags): string[] {
    if (articleTags === {}
       || articleTags
       && articleTags.$value
       && articleTags.$value === null
      ) { return; }

    const tagArray = [];
    for (const tag in articleTags) {
      if (tag) { tagArray.push(tag); }
    }
    return tagArray;
  }

  tagsObjectFromStringArray(tagsArray: string[]): object {
    if (!tagsArray || tagsArray === []) { return null; }

    const tagsObject = {};
    for (const tag of tagsArray) {
      tagsObject[tag.toUpperCase()] = true;
    }

    return tagsObject;
  }

  async captureArticleView(articleId: string, version: number, viewer: UserInfoOpen) {
    const viewFromSession = new Date(sessionStorage.getItem(`view:${articleId}`));
    const msPerMinute = 60000;
    const twoMinutesBack = new Date(new Date().valueOf() - 2 * msPerMinute);
    if (viewFromSession < twoMinutesBack) {
      sessionStorage.setItem(`view:${articleId}`, new Date().toString());
      const articleDoc = this.getArticleById(articleId);
      const viewEntryObject = {
        articleId: articleId,
        viewerUid: (viewer ? viewer.$key : 'anonymous'),
        articleVersion: version,
        viewStart: this.fsServerTimestamp()
      }
      try {
        const docRef = await articleDoc.collection('views').add(viewEntryObject);
        const viewId = docRef.id;
        sessionStorage.setItem('currentViewId', viewId);
        return viewId;
      } catch (err) {
        return err;
      }
    }
  }

  captureArticleUnView(articleId: string, viewId: string) {
    // TOUGH: Not registered when browser refreshed or closed or navigate away from app.
    // Consider using beforeUnload S/O article:
    // https://stackoverflow.com/questions/37642589/how-can-we-detect-when-user-closes-browser/37642657#37642657
    // Consider using session storage as started in captureAricleView - maybe can reliably track viewId and timing or something...
    const viewFromSession = new Date(sessionStorage.getItem(`unView:${articleId}`));
    const msPerMinute = 60000;
    const twoMinutesBack = new Date(new Date().valueOf() - 2 * msPerMinute);
    if (viewFromSession < twoMinutesBack) {
      sessionStorage.setItem(`unView:${articleId}`, new Date().toString());
      const articleDoc = this.getArticleById(articleId);
      return articleDoc.collection('views').doc(viewId).update({ viewEnd: this.fsServerTimestamp() });
    }
  }

  setFeaturedArticle(articleKey: string) {
    this
      .getArticleById(articleKey)
      .update({ isFeatured: true });
  }

  unsetFeaturedArticle(articleKey: string) {
    this
      .getArticleById(articleKey)
      .update({ isFeatured: false });
    }

  getAuthorByKey(authorKey: string) {
    const object = this.rtdb.object(`userInfo/open/${authorKey}`);
    return this.injectObjectKey(object);
  }

  isBookmarked(userKey, articleKey) {
    return this.rtdb
      .object(`userInfo/articleBookmarksPerUser/${userKey}/${articleKey}`)
      .valueChanges()
      .map(article => {
        return article ? true : false;
      });
  }

  bookmarkArticle(userKey, articleKey) {
    this.rtdb
      .object(`userInfo/articleBookmarksPerUser/${userKey}/${articleKey}`)
      .set(firebase.database.ServerValue.TIMESTAMP);
    this.rtdb
      .object(`articleData/userBookmarksPerArticle/${articleKey}/${userKey}`)
      .set(firebase.database.ServerValue.TIMESTAMP);
  }

  unBookmarkArticle(userKey, articleKey) {
    this.rtdb
      .object(`userInfo/articleBookmarksPerUser/${userKey}/${articleKey}`)
      .remove();
    this.rtdb
      .object(`articleData/userBookmarksPerArticle/${articleKey}/${userKey}`)
      .remove();
  }

  navigateToArticleDetail(articleKey: any) {
    this.router.navigate([`articledetail/${articleKey}`]);
  }

  navigateToProfile(uid: any) {
    this.router.navigate([`profile/${uid}`]);
  }

  processGlobalTags(newTags: string[], oldTags: string[], articleId, batch?: firebase.firestore.WriteBatch) {
    // batching does not work.
    // Error is => There must be only one transform for every document,
    // and transform must be after all other operations on the document
    if (newTags) {
      for (const tag of newTags) {
        if (!oldTags.includes(tag)) {
          this.addGlobalTagFirestore(tag, batch);
        }
      }
    }
    if (oldTags && oldTags.length > 0) {
      for (const tag of oldTags) {
        if (!newTags.includes(tag)) {
          this.decrementGlobalTag(tag, batch)
        }
      }
    }
  }

  addGlobalTagFirestore(tag: any, batch?: firebase.firestore.WriteBatch) {
    // batching does not work.
    // Error is => There must be only one transform for every document,
    // and transform must be after all other operations on the document
    const tagsRef = this.getGlobalTags();
    if (this.globalTags) {
      const gTag = this.globalTags[tag];
      if (gTag !== undefined) {
        gTag.count++;
        const tagField = {};
        tagField[tag] = gTag;
        if (batch) {
          batch.update(tagsRef.ref, tagField);
        } else {
          tagsRef.update(tagField);
        }
        return;
      }
    }
    const newTag = {};
    newTag[tag] = {
      timestamp: this.fsServerTimestamp(),
      count: 1
    };
    if (batch) {
      batch.update(tagsRef.ref, newTag);
    } else {
      tagsRef.update(newTag);
    }
  }

  decrementGlobalTag(tag: any, batch?: firebase.firestore.WriteBatch) {
    const tagsRef = this.getGlobalTags();
    if (this.globalTags) {
      const gTag = this.globalTags[tag];
      if (gTag !== undefined && gTag.count > 1) {
        gTag.count--;
        const tagField = {};
        tagField[tag] = gTag;
        if (batch) {
          batch.update(tagsRef.ref, tagField);
        } else {
          tagsRef.update(tagField);
        }
        return;
      }
    }
    delete this.globalTags[tag]
    const tagsFieldDeleter = {};
    tagsFieldDeleter[tag] = firebase.firestore.FieldValue.delete();
    if (batch) {
      batch.update(tagsRef.ref, tagsFieldDeleter);
    } else {
      tagsRef.update(tagsFieldDeleter);
    }
  }

  dbObjectFromBody(body, articleId, version, editorId) {
    return {
      body: body,
      articleId: articleId,
      version: version,
      nextEditorId: editorId
    };
  }

  updateObjectFromArticle(article: ArticleDetailFirestore, articleId: string, lastEditorId: string) {
    return {
      authorId: article.authorId,
      lastEditorId: lastEditorId,
      bodyId: article.bodyId,
      title: article.title,
      introduction: article.introduction,
      lastUpdated: article.lastUpdated,
      timestamp: article.timestamp,
      version: article.version,
      commentCount: article.commentCount,
      viewCount: article.viewCount,
      tags: article.tags || null,
      articleId: articleId,
      isFeatured: article.isFeatured || null
    }
  }

  newObjectFromArticle(article: ArticleDetailFirestore, authorId) {
    return {
      authorId: authorId,
      lastEditorId: authorId,
      title: article.title,
      introduction: article.introduction,
      tags: article.tags,
      version: 1,
      commentCount: 0,
      viewCount: 0,
      isFeatured: false,
      timestamp: this.fsServerTimestamp(),
      lastUpdated: this.fsServerTimestamp()
    }
  }

  primeTags() {
    if (!this.globalTags) {
      const tagsRef = this.getGlobalTags();
      tagsRef.valueChanges()
        .subscribe((tags: any) => {
          if (tags) {
            this.globalTags = tags;
            // resolve();
          } else {
            const seedTag: any = {
              seed: {
                count: 0,
                timestamp: new Date()
              }
            }
            tagsRef.set(seedTag)
              .then(() => {
                // resolve();
              })
              .catch((err) => {
                alert(`
                  No tags exist and we can't make them.
                  Is this a new DB instance?
                  Please send a screenshot of this error to the Scatterschool Dev Team!:
                  ${err.toString()}
                `);
              });
          }
        });
    }
  }

  fsServerTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  injectObjectKey(object: AngularFireObject<{}>) {
    return object
      .snapshotChanges()
      .map(element => {
        return {
          $key: element.key,
          ...element.payload.val()
        };
      });
  }
}
