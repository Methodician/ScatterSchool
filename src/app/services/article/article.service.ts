import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
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
    let tagsObject = {};
    for (let tag of tags) {
      this.db.object(`articleData/tags/${tag}`)
        .take(1)
        .subscribe(data => {
          if (!data.$value)
            this.db.object(`articleData/tags/${tag}`).set(firebase.database.ServerValue.TIMESTAMP);
        });
      tagsObject[tag] = true;
    }
    let bodyKey = this.db.list('articleData/articleBodies').push(article.body).key;
    let articleToSave = {
      title: article.title,
      bodyId: bodyKey,
      tags: tagsObject,
      version: 1,
      author: uid,
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    let articleKey = this.db.list('articleData/articles').push(articleToSave).key;
    this.db.object(`articleData/articlesPerAuthor/${uid}/${articleKey}`).set(true);
    this.db.object(`articleData/editorsPerArticle/${articleKey}/${uid}`).set(true);
    this.db.object(`articleData/articlesPerEditor/${uid}/${articleKey}`).set(true);
    for (let tag of tags) {
      this.db.object(`articleData/articlesPerTag/${tag}/${articleKey}`).set(true);
    }

  }

  setFeaturedArticle(articleKey: string) {
      this.db.object(`articleData/featuredArticles/${articleKey}`).set(firebase.database.ServerValue.TIMESTAMP);
  }

  unsetFeaturedArticle(articleKey: string) {
    firebase.database().ref('articleData/featuredArticles').child(articleKey).remove();
  }

  getAllFeatured() {
    var featuredArticles: Object[];
    var featuredKeys = this.db.list('articleData/featuredArticles');
    
    featuredKeys.subscribe(
    featuredKeys => {
        featuredKeys.map(featuredKeys =>
            // featuredArticles.push(this.db.object(`articleData/articles/${featuredKeys.$key}`))
            this.db.object(`articleData/articles/${featuredKeys.$key}`).subscribe((result) => console.log(result))
        )
    })
    return featuredKeys;
  }
}
