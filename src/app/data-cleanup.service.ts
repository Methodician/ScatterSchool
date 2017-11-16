import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';


@Injectable()
export class DataCleanupService {

  constructor(private db: AngularFireDatabase) { }

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
