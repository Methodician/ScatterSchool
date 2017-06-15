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

  // Refactor by writing function within snapshot? Or leave it as is for readability
  setFeaturedArticle(articleID: string) {
    var nodeExists = false;
    var articleExists = false;
    var ref = firebase.database().ref('articleData/featuredArticles');
    ref.once("value")
      .then(function(snapshot) {
        nodeExists = snapshot.exists(); // True if featuredArticles has been created
        articleExists = snapshot.child('articleData/FeaturedArticles/' + articleID).exists(); // True if article id is already in featuredArticles
      }); 
    // If featuredArticles doesnt exist, create it and push articleID into it
    if(!nodeExists) {
      this.db.list('articleData/featuredArticles').push(articleID);
    } else {
      // If featuredArticles exists, and the articleID doesnt exist, push articleID into it
      if(!articleExists) {
        this.db.list('articleData/featuredArticles').push(articleID); 
      }
    }
  }

  //   Refactored setFeaturedArticle, haven't checked if it works yet
  //   setFeaturedArticle(articleID: string) {
  //   var nodeExists = false;
  //   var articleExists = false;
  //   var ref = firebase.database().ref('articleData/featuredArticles');
  //   ref.once("value")
  //     .then(function(snapshot) {
  //       // If featuredArticles doesnt exist, create it and push articleID into it
  //       if(snapshot.exists()) {
  //         this.db.list('articleData/featuredArticles').push(articleID);
  //       } else {
  //         // If featuredArticles exists, and the articleID doesnt exist, push articleID into it
  //         if(!snapshot.child('articleData/FeaturedArticles/' + articleID).exists()) {
  //           this.db.list('articleData/featuredArticles').push(articleID); 
  //         }
  //       }
  //     }); 
  // }
}
