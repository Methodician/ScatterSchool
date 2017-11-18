import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

import * as firebase from 'firebase';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { ArticleDetailFirestore, GlobalTag, ArticleBodyFirestore } from 'app/shared/class/article-info';
import { ArticleService } from 'app/shared/services/article/article.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class FirestoreArticleService {
  globalTags: Iterable<GlobalTag>;
  constructor(
    private afs: AngularFirestore,
    private articleSvc: ArticleService
  ) {
    this.primeTags();
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
    return this.getArticleById(articleId).collection('history');
  }

  createNewArticle(author: UserInfoOpen, authorId: string, article: any) {
    let newArticle: any = this.newObjectFromArticle(article, authorId);
    //  Terribly un-atomic approach. Research needed on atomic Firestore updates.
    return this.addArticleBody(article.body).then(bodyDoc => {
      const bodyId: string = bodyDoc.id;
      newArticle.bodyId = bodyId;
      return this.addArticle(newArticle).then(articleDoc => {
        const articleId = articleDoc.id;
        for (let tag of newArticle.tags) {
          this.addGlobalTag(tag);
        }
        return articleDoc.collection('editors').doc(authorId).set({
          editorId: authorId,
          name: author.displayName(),
          // TODO: profileImageUrl: author.profileImageUrl
        }).then(editorDoc => {
          return this.addEditedArticleToUser(authorId, articleId).then(() => {
            return this.addAuthoredArticleToUser(authorId, articleId).then(() => {
              return articleId;
            }).catch(err => alert('Trouble adding article authored event to user' + err.toString()))
          }).catch(err => alert('Trouble adding article edit event to user' + err.toString()))
        }).catch(err => alert('Trouble saving article editor' + err.toString()));
      }).catch(err => alert('Trouble saving article' + err.toString()));
    }).catch(err => alert('Trouble saving article body' + err.toString()));
  }

  updateArticle(editorId: string, editor: UserInfoOpen, article: ArticleDetailFirestore, articleId: string) {
    return new Promise(resolve => {
      const articleDoc = this.getArticleById(articleId);
      articleDoc.valueChanges().first()
        .subscribe((oldArticle: ArticleDetailFirestore) => {
          this.processGlobalTags(article.tags, oldArticle.tags, articleId);
          return this.archiveArticle(oldArticle, articleId, editorId)
            .then((res: any) => {
              if (res) {
                // res.unsubscribe();
                this.addArticleBody(article.body).then(bodyDoc => {
                  const bodyId = bodyDoc.id;
                  this.addEditorToArticle(articleId, editorId, editor, articleDoc)
                  const dbArticle: any = this.updateObjectFromArticle(article, articleId);
                  dbArticle.version = article.version + 1;
                  dbArticle.lastUpdated = this.fsServerTimestamp();
                  dbArticle.bodyId = bodyId;
                  articleDoc.update(dbArticle)
                    .then(res => {
                      resolve(true);
                    })
                    .catch(err => {
                      resolve(err);
                    });
                });
              }
              else {
                alert('There was a problem saving to the archive so the update will be halted.');
                resolve(false);
              }
            });
        });
    });
  }


  addArticleBody(body: any) {
    let bodyCollectionRef = this.afs.collection('articleData').doc('bodies').collection('active');
    return bodyCollectionRef.add({ body });
  }

  addArticle(article: any) {
    let articleCollectionRef = this.afs.collection('articleData').doc('articles').collection('articles');
    return articleCollectionRef.add(article)
  }

  addEditorToArticle(articleId, editorId: string, editor: UserInfoOpen, articleDoc) {
    return articleDoc.collection('editors').doc(editorId).set({
      editorId: editorId,
      name: editor.displayName(),
      // TODO: profileImageUrl: author.profileImageUrl
    }).then(editorDoc => {
      return this.addEditedArticleToUser(editorId, articleId).then(() => {
        return articleId;
      }).catch(err => alert('Trouble adding article edit event to user' + err.toString()))
    }).catch(err => alert('Trouble saving article editor' + err.toString()))
      .catch(err => alert('Trouble adding editor to article' + err.toString()));
  }

  addEditedArticleToUser(userId: string, articleId: string) {
    let docRef = this.afs.collection('userData').doc(userId).collection('articlesEdited').doc(articleId);
    return docRef.set({
      timestamp: this.fsServerTimestamp(),
      articleId: articleId
    });
  }

  addAuthoredArticleToUser(userId: string, articleId: string) {
    let docRef = this.afs.collection('userData').doc(userId).collection('articlesAuthored').doc(articleId);
    return docRef.set({
      timestamp: this.fsServerTimestamp(),
      articleId: articleId
    });
  }

  archiveArticle(oldArticle: ArticleDetailFirestore, articleId: string, editorId: string): Promise<any> {
    const archiveRef = this.getArchivedArticlesById(articleId).doc(oldArticle.version.toString());
    const bodyRef = this.getArticleBodyById(oldArticle.bodyId);
    const archiveObject = this.updateObjectFromArticle(oldArticle, articleId);
    return new Promise(resolve => {
      archiveRef.set(archiveObject)
        .then(() => {
          let bodySub = bodyRef.valueChanges().first()
            .subscribe((body: ArticleBodyFirestore) => {
              this.archiveArticleBody(body, oldArticle.bodyId, articleId, editorId, oldArticle.version)
                .then((res) => {
                  // if (archiveWasSuccessful)
                  resolve(true);
                })
                .catch(err => {
                  alert('trouble deleting old article body. Please take a screenshot and report to ScatterSchool team' + err.toString());
                  resolve(err);
                })
            })
        })
        .catch(err => {
          resolve(err);
          alert('Trouble archiving the article. Please take a screenshot and report to scatterschool team' + err.toString()
          )
        }
        );
    })

  }

  archiveArticleBody(articleBody: ArticleBodyFirestore, bodyId: string, articleId: string, editorId: string, version: number) {
    const bodyLogObject: any = {};
    bodyLogObject.body = articleBody.body;
    bodyLogObject.articleId = articleId;
    bodyLogObject.version = version;
    bodyLogObject.nextEditorId = editorId;
    return this.afs.doc(`articleData/bodies/history/${bodyId}`).set(bodyLogObject);
  }

  processGlobalTags(newTags: string[], oldTags: string[], articleId) {
    let deletedTags = [];
    if (newTags) {
      for (let tag of newTags) {
        if (!oldTags.includes(tag))
          this.addGlobalTag(tag);
      }
    }

    if (oldTags && oldTags.length > 0) {
      for (let tag of oldTags) {
        if (!newTags.includes(tag)) {
          deletedTags.push(tag);
        }
      }
    }

    for (let tag of deletedTags) {
      this.decrementGlobalTag(tag);
    }
  }

  addGlobalTag(tag: any) {
    const tagsRef = this.afs.doc('articleData/tags');
    if (this.globalTags) {
      let gTag = this.globalTags[tag];
      if (gTag !== undefined) {
        gTag.count++;
        let tagField = {};
        tagField[tag] = gTag;
        tagsRef.update(tagField);
        return;
      }
    }
    let newTag = {};
    newTag[tag] = {
      timestamp: this.fsServerTimestamp(),
      count: 1
    };
    tagsRef.update(newTag);
  }

  decrementGlobalTag(tag: any) {
    const tagsRef = this.afs.doc('articleData/tags');
    if (this.globalTags) {
      let gTag = this.globalTags[tag];
      if (gTag !== undefined && gTag.count > 1) {
        gTag.count--;
        let tagField = {};
        tagField[tag] = gTag;
        tagsRef.update(tagField);
        return;
      }
    }
    delete this.globalTags[tag]
    let tagsFieldDeleter = {};
    tagsFieldDeleter[tag] = firebase.firestore.FieldValue.delete();
    tagsRef.update(tagsFieldDeleter);
  }

  updateObjectFromArticle(article: ArticleDetailFirestore, articleId: string) {
    return {
      authorId: article.authorId,
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
      title: article.title,
      introduction: article.introduction,
      tags: article.tags,
      version: 1,
      authorId: authorId,
      commentCount: 0,
      viewCount: 0,
      isFeatured: false,
      timestamp: this.fsServerTimestamp(),
      lastUpdated: this.fsServerTimestamp()
    }
  }

  primeTags() {
    return new Promise(resolve => {
      if (!this.globalTags) {
        const tagsRef = this.afs.doc('articleData/tags');
        tagsRef.valueChanges()
          .subscribe((tags: any) => {
            if (tags) {
              this.globalTags = tags;
              resolve();
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
                  resolve();
                })
                .catch((err) => {
                  alert("no tags exist and we can't make them" + err.toString());
                });
            }
          });
      }
      else {
        resolve();
      }
    });
  }

  fsServerTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

}
