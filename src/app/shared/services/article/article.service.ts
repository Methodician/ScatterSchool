import { ArticleDetailOpen, GlobalTag, ArticleDetailFirestore, ArticleBodyFirestore } from 'app/shared/class/article-info';
import { Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
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
    private afd: AngularFireDatabase,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.primeTags();
  }

  getGlobalTags() {
    return this.afs.doc('articleData/tags');
  }

  getAllArticlesFirestore() {
    return this.afs.collection('articleData').doc('articles').collection('articles')
  }

  getLatestArticles() {
    return this.afs.collection('articleData').doc('articles').collection('articles', ref => ref.orderBy('timestamp', 'desc').limit(12));
  }

  getFeaturedArticles() {
    return this.afs.collection('articleData').doc('articles').collection('articles', ref => ref.where('isFeatured', '==', true));
  }

  getArticleById(articleId: string) {
    return this.afs.doc(`articleData/articles/articles/${articleId}`);
  }

  getArticleBodyById(bodyId: string): AngularFirestoreDocument<ArticleBodyFirestore> {
    return this.afs.doc(`articleData/bodies/active/${bodyId}`);
  }

  getArchivedArticleBodyById(bodyId: string) {
    return this.afs.doc(`articleData/bodies/history/${bodyId}`);
  }

  getArchivedArticlesById(articleId: string) {
    return this.getArticleById(articleId).collection('history', ref => ref.orderBy('version'));
  }

  getArticlesEditedByUid(userId: string) {
    return this.afs.collection('userData').doc(userId).collection('articlesEdited');
  }

  getArticlesAuthoredByUid(userId: string) {
    return this.afs.collection('userData').doc(userId).collection('articlesAuthored');
  }

  getAllArticles() {
    return this.afd.list('articleData/articles').map(articles => {
      return articles.map(article => {
        article.tags = this.tagsArrayFromTagsObject(article.tags);
        return article;
      });
    });
  }

  getArticleByKey(articleKey: string) {
    return this.afd.object(`articleData/articles/${articleKey}`).map(article => {
      article.tags = this.tagsArrayFromTagsObject(article.tags);
      return article;
    });
  }

  getArticleBodyByKey(bodyKey: string) {
    return this.afd.object('articleData/articleBodies/' + bodyKey);
  }

  findArticlesForKeys(articleKeys$: Observable<any[]>): Observable<ArticleDetailOpen[]> {
    return articleKeys$
      .map(articlesPerKey => articlesPerKey
        .map(article =>
          this.afd.object(`articleData/articles/${article.$key}`)
            .map(article => {
              article.tags = this.tagsArrayFromTagsObject(article.tags);
              return article;
            })))
      .flatMap(firebaseObjects =>
        Observable.combineLatest(firebaseObjects));
  }

  findArticlesPerEditor(editorKey: string): Observable<ArticleDetailOpen[]> {
    return this.findArticlesForKeys(this.afd.list(`articleData/articlesPerEditor/${editorKey}`));
  }

  findArticlesPerAuthor(authorKey: string): Observable<ArticleDetailOpen[]> {
    return this.findArticlesForKeys(this.afd.list(`articleData/articlesPerAuthor/${authorKey}`));
  }

  getArticleBodyFromArchiveByKey(bodyKey: string) {
    return this.afd.object(`articleData/articleBodyArchive/${bodyKey}/body`)
  }

  getArticleHistoryByKey(articleKey: string) {
    return this.afd.list(`articleData/articleArchive/${articleKey}`)
      .map(articles => {
        return articles.map(article => {
          article.tags = this.tagsArrayFromTagsObject(article.tags);
          return article;
        })
      });
  }


  async createNewArticle(author: UserInfoOpen, authorId: string, article: any) {
    const articleId = await this.createNewArticleFirestore(author, authorId, article);
    return articleId;
    // return this.createNewArticleFirebase(authorId, article);
  }

  async createNewArticleFirestore(author: UserInfoOpen, authorId: string, article: any) {
    let batch = this.afs.firestore.batch();
    let newArticle: any = this.newObjectFromArticle(article, authorId);

    const bodyId = this.afs.createId();
    newArticle.bodyId = bodyId;
    const articleId = this.afs.createId();
    newArticle.articleId = articleId;
    const bodyRef = this.getArticleBodyById(bodyId).ref;
    const newBody = this.dbObjectFromBody(article.body, articleId, 1, authorId);
    batch.set(bodyRef, newBody);

    const articleRef = this.getArticleById(articleId).ref;
    batch.set(articleRef, newArticle);

    const articleEditorRef = this.getArticleById(articleId).collection('editors').doc(authorId).ref;
    batch.set(articleEditorRef, {
      editorId: authorId,
      name: author.displayName()
    });

    const userArticleEditedRef = this.getArticlesEditedByUid(authorId).doc(articleId).ref;
    batch.set(userArticleEditedRef, {
      timestamp: this.fsServerTimestamp(),
      articleId: articleId
    });

    const userArticleAuthoredRef = this.getArticlesAuthoredByUid(authorId).doc(articleId).ref;
    batch.set(userArticleAuthoredRef, {
      timestamp: this.fsServerTimestamp(),
      articleId: articleId
    });

    for (let tag of article.tags) {
      this.addGlobalTagFirestore(tag);
    }

    try{
      await batch.commit();
      return articleId;
    }
    catch (err){
      alert('There was a problem saving your article. Please share a screenshot of the error with the ScatterSchool dev. team' + err.toString());
      return err.toString();
    }

    // return batch.commit()
    //   .then(success => {
    //     return articleId;
    //   })
    //   .catch(err => {
    //     alert('There was a problem saving your article. Please share a screenshot of the error with the ScatterSchool dev. team' + err.toString());
    //   });
  }

  createNewArticleFirebase(authorKey: string, article: any) {

    let bodyKey = this.afd.list('articleData/articleBodies').push(article.body).key;
    let tagsObject = this.tagsObjectFromStringArray(article.tags);

    let articleToSave = {
      title: article.title,
      introduction: article.introduction,
      bodyKey: bodyKey,
      tags: tagsObject,
      version: 1,
      authorKey: authorKey,
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }

    let articleKey = this.afd.list('articleData/articles').push(articleToSave).key;
    this.afd.object(`articleData/articlesPerAuthor/${authorKey}/${articleKey}`).set(true);

    let tags = article.tags;
    if (tags) {
      for (let tag of tags) {
        this.afd.object(`articleData/articlesPerTag/${tag}/${articleKey}`).set(true);
        this.addGlobalTagFirebase(tag);
      }
    }
    return articleKey;
  }

  updateArticle(editorId: string, editor: UserInfoOpen, article: ArticleDetailFirestore, articleId: string) {
    //return this.updateArticleFirebase(editorId, article);
    return this.updateArticleFirestore(editorId, editor, article, articleId);
  }

  updateArticleFirestore(editorId: string, editor: UserInfoOpen, article: ArticleDetailFirestore, articleId: string) {
    return new Promise(resolve => {
      let batch = this.afs.firestore.batch();
      //  Wondering if we should stop using this and just get the lastest from history...
      const articleDoc = this.getArticleById(articleId);

      articleDoc.valueChanges().first()
        .subscribe((oldArticle: ArticleDetailFirestore) => {
          const newBodyId = this.afs.createId();
          const archiveArticleObject = this.updateObjectFromArticle(oldArticle, articleId, oldArticle.lastEditorId);
          let updatedArticleObject: any = this.updateObjectFromArticle(article, articleId, editorId);
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
            .subscribe((body: ArticleBodyFirestore) => {
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

              batch.commit()
                .then(success => {
                  resolve(true);
                })
                .catch(err => {
                  if (err.code == 'permission-denied') {
                    alert('There was a problem saving your article related to access permissions. If that doesn\'t sound quite right, please submit a bug report to the ScatterSchool github page or just share a screenshot of this message with the dev team at https://flight.run. Thanks! Error: ' + err);
                    resolve(err);
                  }
                  else {
                    alert('There was a problem saving your article. Please share a screenshot of the error with the ScatterSchool dev. team' + err.toString());
                    resolve(err);
                  }
                });
            });

        });
    });
  }

  updateArticleFirebase(editorKey: string, article: any) {
    const oldBodyKey = article.bodyKey;
    const articleKey = article.articleKey;
    let tagsObject = this.tagsObjectFromStringArray(article.tags);

    //  Really wanted to reduce trips to the afd...
    this.afd.object(`articleData/articles/${articleKey}/tags`)
      .map(tags => this.tagsArrayFromTagsObject(tags))
      .subscribe(oldTags => {
        if ((article.tags && article.tags != []) || (oldTags && oldTags != [])) {
          this.processTagsEdit(article.tags, oldTags, articleKey);
        }
      });

    this.archiveArticle(articleKey);
    this.afd.object(`articleData/articleBodies/${oldBodyKey}`)
      .take(1).subscribe(body => {
        let bodyLogObject: any = {};
        bodyLogObject.body = body.$value;
        bodyLogObject.articleKey = articleKey;
        bodyLogObject.version = article.version;
        bodyLogObject.nextEditorKey = editorKey;
        this.afd.object(`articleData/articleBodyArchive/${oldBodyKey}`).set(bodyLogObject).then(res => {
          this.afd.object(`articleData/articleBodies/${oldBodyKey}`).remove();
        });
        this.afd.object(`articleData/bodysPerArticle/${articleKey}/${oldBodyKey}`).set(firebase.database.ServerValue.TIMESTAMP);
      });
    let bodyKey = this.afd.list('articleData/articleBodies').push(article.body).key;
    let currentLogObject = {
      body: article.body,
      articleKey: null,
      version: 'current',
      nextEditorKey: null
    };
    this.afd.object(`articleData/articleBodyArchive/${bodyKey}`).set(currentLogObject);
    let articleToUpdate: any = {
      title: article.title,
      introduction: article.introduction,
      bodyKey: bodyKey,
      tags: tagsObject,
      version: article.version + 1,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    this.afd.object(`articleData/editorsPerArticle/${articleKey}/${editorKey}`).set(true);
    this.afd.object(`articleData/articlesPerEditor/${editorKey}/${articleKey}`).set(true);
    articleToUpdate.authorKey = article.authorKey;
    this.afd.object(`articleData/articleArchive/${articleKey}/current`).set(articleToUpdate);

    return this.afd.object(`articleData/articles/${articleKey}`).update(articleToUpdate);
  }

  tagsArrayFromTagsObject(articleTags): string[] {
    if (articleTags == {} || (articleTags && articleTags.$value && articleTags.$value == null))
      return null;

    let tagArray = [];
    for (let tag in articleTags) {
      tagArray.push(tag);
    }
    return tagArray;
  }

  tagsObjectFromStringArray(tagsArray: string[]): object {
    if (!tagsArray || tagsArray == [])
      return null;

    let tagsObject = {};
    for (let tag of tagsArray) {
      tagsObject[tag.toUpperCase()] = true;
    }

    return tagsObject;
  }

  addGlobalTagFirebase(tag: string) {
    this.afd.object(`articleData/tags/${tag}`).take(1).subscribe(data => {
      if (!data.$key)
        this.afd.object(`articleData/tags/${tag}`).set(firebase.database.ServerValue.TIMESTAMP);
    });
  }

  processTagsEdit(newTags, oldTags, articleKey) {
    let deletedTags = [];

    if (newTags) {
      for (let tag of newTags) {
        this.afd.object(`articleData/articlesPerTag/${tag}/${articleKey}`).set(true);
        this.addGlobalTagFirebase(tag);
      }
    }

    if (oldTags && (oldTags && oldTags.$value && oldTags.$value != null)) {
      for (let tag of oldTags) {
        if (!newTags.includes(tag)) {
          deletedTags.push(tag);
        }
      }
    }

    for (let tag of deletedTags) {
      this.afd.object(`articleData/articlesPerTag/${tag}/${articleKey}`).remove();
    }

  }

  archiveArticle(articleKey) {
    this.afd.object(`articleData/articles/${articleKey}`).take(1).subscribe(article => {
      this.afd.object(`articleData/articleArchive/${articleKey}/${article.version}`).set(article);
    });
  }

  async captureArticleView(articleId: string, version: number, viewer: UserInfoOpen) {
    const viewFromSession = new Date(sessionStorage.getItem(`view:${articleId}`));
    const msPerMinute = 60000;
    const twoMinutesBack = new Date(new Date().valueOf() - 2 * msPerMinute);
      if(viewFromSession < twoMinutesBack){
        sessionStorage.setItem(`view:${articleId}`, new Date().toString());
          const articleDoc = this.getArticleById(articleId);
          const viewEntryObject = {
            articleId: articleId,
            viewerUid: (viewer ? viewer.$key : 'anonymous'),
            articleVersion: version,
            viewStart: this.fsServerTimestamp()
          }
          try{
            const docRef = await articleDoc.collection('views').add(viewEntryObject);
            const viewId = docRef.id;
            sessionStorage.setItem('currentViewId', viewId);
            return viewId;
          }
          catch (err){
            return err;
          }
      }
    
    // return new Promise<any>(resolve => {
    //   if (viewFromSession < twoMinutesBack) {
    //     sessionStorage.setItem(`view:${articleId}`, new Date().toString());
    //     const articleDoc = this.getArticleById(articleId);
    //     const viewEntryObject = {
    //       articleId: articleId,
    //       viewerUid: (viewer ? viewer.$key : 'anonymous'),
    //       articleVersion: version,
    //       viewStart: this.fsServerTimestamp()
    //     }
    //     articleDoc.collection('views').add(viewEntryObject)
    //       .then(docRef => {
    //         const viewId = docRef.id
    //         sessionStorage.setItem('currentViewId', viewId)
    //         resolve(viewId);
    //       })
    //       .catch(err => {
    //         resolve(err);
    //       });
    //   }
    // });
  }

  captureArticleUnView(articleId: string, viewId: string) {
    //  TOUGH: Not registered when browser refreshed or closed or navigate away from app.
    //  Consider using beforeUnload S/O article: https://stackoverflow.com/questions/37642589/how-can-we-detect-when-user-closes-browser/37642657#37642657 
    //  Consider using session storage as started in captureAricleView - maybe can reliably track viewId and timing or something...
    const viewFromSession = new Date(sessionStorage.getItem(`unView:${articleId}`));
    const msPerMinute = 60000;
    const twoMinutesBack = new Date(new Date().valueOf() - 2 * msPerMinute);
    if (viewFromSession < twoMinutesBack) {
      sessionStorage.setItem(`unView:${articleId}`, new Date().toString());
      const articleDoc = this.getArticleById(articleId);
      return articleDoc.collection('views').doc(viewId).update({ viewEnd: this.fsServerTimestamp() });
    }
  }

  isArticleFeatured(articleKey: string) {
    return this.afd.object(`articleData/featuredArticles/${articleKey}`).map(res => {
      if (res.$value)
        return true;
      return false;
    });
  }

  setFeaturedArticle(articleKey: string) {
    //  Firestore way:
    this.getArticleById(articleKey).update({ isFeatured: true });
    //  Firebase way:
    // this.afd.object(`articleData/featuredArticles/${articleKey}`).set(firebase.database.ServerValue.TIMESTAMP);
  }

  unsetFeaturedArticle(articleKey: string) {
    //  Firestore way:
    this.getArticleById(articleKey).update({ isFeatured: false });
    //  Firebase way:
    // firebase.database().ref('articleData/featuredArticles').child(articleKey).remove();
  }

  getAllFeatured() {
    return this.findArticlesForKeys(this.afd.list('articleData/featuredArticles'));
  }

  // getLatest() {
  //   return this.afd.list('articleData/articles', {
  //     query: {
  //       orderByChild: 'timeStamp',
  //       limitToLast: 12
  //     }
  //   }).map(articles => {
  //     articles.map(article => {
  //       article.tags = this.tagsArrayFromTagsObject(article.tags);
  //       return article;
  //     });
  //     return articles;
  //   });
  // }

  getAuthorByKey(authorKey: string) {
    return this.afd.object(`userInfo/open/${authorKey}`);
  }

  isBookmarked(userKey, articleKey) {
    return this.afd.object(`userInfo/articleBookmarksPerUser/${userKey}/${articleKey}`).map(article => {
      if (article.$value)
        return true;
      return false;
    });
  }

  bookmarkArticle(userKey, articleKey) {
    this.afd.object(`userInfo/articleBookmarksPerUser/${userKey}/${articleKey}`).set(firebase.database.ServerValue.TIMESTAMP);
    this.afd.object(`articleData/userBookmarksPerArticle/${articleKey}/${userKey}`).set(firebase.database.ServerValue.TIMESTAMP);
  }

  unBookmarkArticle(userKey, articleKey) {
    this.afd.object(`userInfo/articleBookmarksPerUser/${userKey}/${articleKey}`).remove();
    this.afd.object(`articleData/userBookmarksPerArticle/${articleKey}/${userKey}`).remove();
  }

  //returns each article a particular user has bookmarked
  getBookmarksByUserKey(userKey) {
    return this.afd.list(`userInfo/articleBookmarksPerUser/${userKey}`)
      .map(bookmark => {
        return bookmark.map(article => this.afd.object(`articleData/articles/${article.$key}`));
      })
      .flatMap(firebaseObjectObservables => {
        return Observable.combineLatest(firebaseObjectObservables)
      });
  }

  //returns each user that has bookmarked a particular article
  getUsersByArticleKey(articleKey) {
    return this.afd.list(`articleData/userBookmarksPerArticle/${articleKey}`)
      .map(article => {
        return article.map(user => this.afd.object(`userInfo/open/${user.$key}`));
      })
      .flatMap(FirebaseObjectObservable => {
        return Observable.combineLatest(FirebaseObjectObservable)
      });
  }

  navigateToArticleDetail(articleKey: any) {
    this.router.navigate([`articledetail/${articleKey}`]);
  }

  navigateToProfile(uid: any) {
    this.router.navigate([`profile/${uid}`]);
  }

  processGlobalTags(newTags: string[], oldTags: string[], articleId, batch?: firebase.firestore.WriteBatch) {
    //  batching does not work. Error is => There must be only one transform for every document, and transform must be after all other operations on the document
    if (newTags) {
      for (let tag of newTags) {
        if (!oldTags.includes(tag))
          this.addGlobalTagFirestore(tag, batch);
      }
    }
    if (oldTags && oldTags.length > 0) {
      for (let tag of oldTags) {
        if (!newTags.includes(tag)) {
          this.decrementGlobalTag(tag, batch)
        }
      }
    }
  }

  addGlobalTagFirestore(tag: any, batch?: firebase.firestore.WriteBatch) {
    //  batching does not work. Error is => There must be only one transform for every document, and transform must be after all other operations on the document
    const tagsRef = this.getGlobalTags();
    if (this.globalTags) {
      let gTag = this.globalTags[tag];
      if (gTag !== undefined) {
        gTag.count++;
        let tagField = {};
        tagField[tag] = gTag;
        if (batch)
          batch.update(tagsRef.ref, tagField);
        else
          tagsRef.update(tagField);
        return;
      }
    }
    let newTag = {};
    newTag[tag] = {
      timestamp: this.fsServerTimestamp(),
      count: 1
    };
    if (batch)
      batch.update(tagsRef.ref, newTag);
    else
      tagsRef.update(newTag);
  }

  decrementGlobalTag(tag: any, batch?: firebase.firestore.WriteBatch) {
    const tagsRef = this.getGlobalTags();
    if (this.globalTags) {
      let gTag = this.globalTags[tag];
      if (gTag !== undefined && gTag.count > 1) {
        gTag.count--;
        let tagField = {};
        tagField[tag] = gTag;
        if (batch)
          batch.update(tagsRef.ref, tagField);
        else
          tagsRef.update(tagField);
        return;
      }
    }
    delete this.globalTags[tag]
    let tagsFieldDeleter = {};
    tagsFieldDeleter[tag] = firebase.firestore.FieldValue.delete();
    if (batch)
      batch.update(tagsRef.ref, tagsFieldDeleter);
    else
      tagsRef.update(tagsFieldDeleter);
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
    // return new Promise(resolve => {
    if (!this.globalTags) {
      const tagsRef = this.getGlobalTags();
      tagsRef.valueChanges()
        .subscribe((tags: any) => {
          if (tags) {
            this.globalTags = tags;
            // resolve();
          }
          else {
            let seedTag: any = {
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
                alert("no tags exist and we can't make them. Is this a new DB instance? Please send a screenshot of this error to the Scatterschool Dev Team!" + err.toString());
              });
          }
        });
    }
    //   else {
    //     resolve();
    //   }
    // });
  }

  fsServerTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}
