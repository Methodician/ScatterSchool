import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase'

@Injectable()
export class DataCleanupService {
  fsDb = firebase.firestore();

  constructor(
    private fbd: AngularFireDatabase,
    private fsd: AngularFirestore
  ) { }


  articleNodeIdToKey() {
    return this.fbd.list('articleData/articles').subscribe(articles => {
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

        console.log(article);
        this.fbd.object(`articleData/articles/${article.$key}`).set(article);
      }
    });
  }


}
