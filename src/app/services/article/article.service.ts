import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class ArticleService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  getAllArticles() {
    return this.db.list('articleData/articles');
  }

  createNewArticle(uid: string, article: any) {
    // ToDo: We need better code to remove spaces only before and after the comma because this code prevents spaces in tags
    let tags = article.tags.replace(/\s/g, '').split(',');
    console.log(tags);
    let bodyKey = this.db.list('articleData/articleBodies').push(article.body).key;
    /*    let articleToSave = {
          title: article.title,
          tags: tags,
    
        }
        this.db.list('articleData/articles').push(article).then(key => console.log);*/
  }

}
