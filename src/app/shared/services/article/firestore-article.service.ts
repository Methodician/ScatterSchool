import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

import * as firebase from 'firebase';
import { UserInfoOpen } from 'app/shared/class/user-info';

@Injectable()
export class FirestoreArticleService {

  constructor(
    private afs: AngularFirestore
  ) { }

  createNewArticle(author: UserInfoOpen, authorId: string, article: any) {
    let newArticle: any = {
      title: article.title,
      introduction: article.introduction,
      tags: article.tags,
      version: 1,
      authorId: authorId,
      commentCount: 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    }
    return this.addArticleBody(article.body).then(bodyDoc => {
      const bodyId: string = bodyDoc.id;
      newArticle.bodyId = bodyId;
      return this.addArticle(newArticle).then(articleDoc => {
        const articleId = articleDoc.id;
        return articleDoc.collection('editors').doc(authorId).set({
          editorId: authorId,
          name: author.displayName(),
          // TODO: profileImageUrl: author.profileImageUrl
        }).then(editorDoc => {
          return articleId;
        }).catch(err => alert('Trouble saving article author' + err));
      }).catch(err => alert('Trouble saving article' + err));
    }).catch(err => alert('Trouble saving article body' + err));
  }

  addArticleBody(body: any) {
    let bodyCollectionRef = this.afs.collection('articleData').doc('bodies').collection('active');
    return bodyCollectionRef.add({ body });
  }

  addArticle(article: any) {
    let articleCollectionRef = this.afs.collection('articleData').doc('articles').collection('articles');
    return articleCollectionRef.add(article)
  }

  addEditorToArticle(articleId) {
    // turned out wasn't needed yet
  }

  addEditedArticleToUser(userId: string, articleId: string) {
    let docRef = this.afs.collection('userData').doc(userId).collection('articlesEdited').doc('articleId');
    return docRef.set({
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      articleId: articleId
    });
  }

  addAuthoredArticleToUser(userId: string, articleId: string) {
    let docRef = this.afs.collection('userData').doc(userId).collection('articlesAuthored').doc('articleId');
    return docRef.set({
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      articleId: articleId
    });
  }



}
