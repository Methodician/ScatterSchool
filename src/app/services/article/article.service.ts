import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
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

  getArticleById(articleKey: string) {
    return this.db.object(`articleData/articles/${articleKey}`);
  }

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
      introduction: article.introduction,
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
    console.log('UPDATING ARTICLE:', article);
    let tags = article.tags.replace(/\s/g, '').split(',');
    let tagsObject = {};
    console.log('TAGS IN ARTICLE', tags);
    for (let tag of tags) {
      this.db.object(`articleData/tags/${tag}`)
        .take(1)
        .subscribe(data => {
          if (!data.$value)
            this.db.object(`articleData/tags/${tag}`).set(firebase.database.ServerValue.TIMESTAMP);
        });
      tagsObject[tag] = true;
    }
    console.log('TAGS OBJECT', tagsObject);
    //create a new article body with a new key and save the key
    let bodyKey = this.db.list('articleData/articleBodies').push(article.body).key;
    let articleToUpdate = {
      title: article.title,
      introduction: article.introduction,
      bodyId: bodyKey,
      tags: tagsObject,
      version: article.version + 1,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    let articleKey = article.articleId;
    this.db.object(`articleData/editorsPerArticle/${articleKey}/${uid}`).set(true);
    this.db.object(`articleData/articlesPerEditor/${uid}/${articleKey}`).set(true);
    for (let tag of tags) {
      this.db.object(`articleData/articlesPerTag/${tag}/${articleKey}`).set(true);
    }
    console.log('EDITING ARTICLE:', articleToUpdate);
    return this.db.object(`articleData/articles/${articleKey}`).update(articleToUpdate);
  }
  //do not include the articlesPerAuthor key
  //you might need to include a version number if it's not included
  //create a loop for the tag of tags and for each of the tags you have to see if the tag
  //increment versions, articleToUpdate = article.version +1


  setFeaturedArticle(articleKey: string) {
    this.db.object(`articleData/featuredArticles/${articleKey}`).set(firebase.database.ServerValue.TIMESTAMP);
  }

  unsetFeaturedArticle(articleKey: string) {
    firebase.database().ref('articleData/featuredArticles').child(articleKey).remove();
  }

  getAllFeatured() {
    var featuredArticles = new Array();
    this.db.list('articleData/featuredArticles').subscribe(keys => {
      keys.forEach(index => {
              this.getArticleById(index.$key).
              subscribe(dataLastEmittedFromObserver => {
                featuredArticles.push(dataLastEmittedFromObserver);
            })
      })
    })
    return featuredArticles;
  }

  getLatest() {
    var latestArticles = new Array();
    this.db.list('articleData/articles', {
      query: {
        orderByChild: 'timeStamp',
        limitToLast: 7
      }
    }).map((array) => array.reverse()).subscribe(articles => {
      articles.forEach(index => {
        latestArticles.push(index);
      })
    })
    return latestArticles;
  }

  searchArticles(searchStr: string) {
    // Lowercase the search string so you can compared to lowercase titles and tags for cap sensitivity
    var searchRef = searchStr.toLowerCase();
    var foundArticles = new Array();
    // Iterate through all the articles
    this.getAllArticles().subscribe(articles => {
      articles.forEach(index => {
        // If the title contains the search string
        if(index.title.toLowerCase().includes(searchRef)) {
          // If the title contains the search string add the article to the array
          foundArticles.push(index);
        } else {
          for(var i = 0; i < Object.keys(index.tags).length; i++) {
            // If the title doesn't contain the string, iterate through the tags and check if the tags contain the search string
            if(Object.keys(index.tags)[i].toString().toLowerCase().includes(searchRef)) {
              // If the tags contain the search string add the article to the array and break out of for loop
              foundArticles.push(index);
              break;
            }
          }
        }
      })
    });
    return foundArticles;
  }

  getAuthorById(authorKey: string) {
    var author;
    this.db.object(`userInfo/open/${authorKey}`).subscribe(data => author = data);
    return author;
  }

  getArticleDetails() {
    console.log("You got the Article Details, friend.")
  }
}
