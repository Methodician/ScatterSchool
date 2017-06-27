import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class ArticleService {

  articles: FirebaseListObservable<any[]>;
  article: FirebaseObjectObservable<any>;
  folder: any;

  constructor(
    private db: AngularFireDatabase
  ) {
    this.articles = this.db.list('/articles') as FirebaseListObservable<ArticleService[]>
   }

  getAllArticles() {
    return this.db.list('articleData/articles');
  }

  //getAllArticles by id
  getArticleById(id: string) {
    return this.db.object('articleData/articles/' + id);
  }
  //getArticleBody which will also take an id
  getArticleBodyById(id: string) {
    return this.db.object('articleData/articleBodies/' + id);
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

  updateArticle(uid: string, article: any) {
    //construct an object for the article to save
    //break tags into an array of objects and treat the tags like create articleSvc
    console.log(article);
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
    //create a new article body with a new key and save the key
    let bodyKey = this.db.list('articleData/articleBodies').push(article.body).key;
    console.log("version!!"); 
    console.log(article.version);
    let articleToUpdate = {
      title: article.title,
      bodyId: bodyKey,
      tags: tagsObject,
      version: article.version +1,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    let articleKey = this.db.list('articleData/articles').push(articleToUpdate).key;
    this.db.object(`articleData/editorsPerArticle/${articleKey}/${uid}`).set(true);
    this.db.object(`articleData/articlesPerEditor/${uid}/${articleKey}`).set(true);
      for (let tag of tags) {
        this.db.object(`articleData/articlesPerTag/${tag}/${articleKey}`).set(true);
      }
      return this.articles.update(uid, article);
    }
    //do not include the articlesPerAuthor key
    //you might need to include a version number if it's not included
    //create a loop for the tag of tags and for each of the tags you have to see if the tag
    //increment versions, articleToUpdate = article.version +1
  }
