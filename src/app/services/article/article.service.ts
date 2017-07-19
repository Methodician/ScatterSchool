import { ArticleDetailOpen } from './article-info';
import { Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router'

import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ArticleService {
  // KYLE -> Not sure if you just addeed this @input. I'm also removing these old things below it... See my notes by your function.
  //@Input() articleData: any;


  constructor(
    private db: AngularFireDatabase,
    private router: Router
  ) { }

  getAllArticles() {
    return this.db.list('articleData/articles');
  }

  getArticleById(articleKey: string) {
    return this.db.object(`articleData/articles/${articleKey}`);
  }

  getArticleBodyById(id: string) {
    return this.db.object('articleData/articleBodies/' + id);
  }

  findArticlesForKeys(articleKeys$: Observable<any[]>): Observable<ArticleDetailOpen[]> {
    return articleKeys$
      .map(articlesPerKey =>
        articlesPerKey.map(article =>
          this.db.object(`articleData/articles/${article.$key}`)))
      .flatMap(firebaseObjects =>
        Observable.combineLatest(firebaseObjects));
  }

  findArticlesPerEditor(editorId: string): Observable<ArticleDetailOpen[]> {
    return this.findArticlesForKeys(this.db.list(`articleData/articlesPerEditor/${editorId}`));
  }

  findArticlesPerAuthor(authorId: string): Observable<ArticleDetailOpen[]> {
    return this.findArticlesForKeys(this.db.list(`articleData/articlesPerAuthor/${authorId}`));
  }

  createNewArticle(uid: string, article: any) {
    //const subject = new Subject<string>();
    let tagsObject = {};
    let tags = article.tags;

    if (article.tags && article.tags != '') {
      this.processTags(tags, tagsObject);
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
    if (article.tags && article.tags != '') {
      for (let tag of tags) {
        this.db.object(`articleData/articlesPerTag/${tag}/${articleKey}`).set(true);
      }
    }
    return articleKey;
    //subject.next(articleKey);
    //return subject.asObservable();
  }

  updateArticle(uid: string, article: any) {
    let tags = article.tags;
    let tagsObject = {};
    let newBodyKey = '';
    this.processTags(tags, tagsObject);
    console.log('TAGS OBJECT', tagsObject);
    this.db.object(`articleData/articleBodies/${article.bodyId}`).subscribe(body => {
      let bodyLogObject: any = {};
      bodyLogObject.body = body.$value;
      bodyLogObject.parentKey = article.$key;
      bodyLogObject.version = article.version;
      bodyLogObject.nextEditorId = uid;
      this.db.object(`articleData/bodyLog/${body.$key}`).set(bodyLogObject);
      this.db.object(`articleData/bodysPerArticle/${article.$key}/${body.$key}`).set(firebase.database.ServerValue.TIMESTAMP);
    });
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

  processTags(tagsToProcess, outputTagsObject) {
    // ToDo: We need better code to remove spaces only before and after the comma because this code prevents spaces in tags
    // Need to process further to avoid bugs. Firebase error: ERROR Error: Firebase.child failed: First argument was an invalid path: "articleData/tags/WEREGOINGTOFRANCE.". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"
    let tags = tagsToProcess.replace(/\s/g, '').split(',');
    for (let tag of tags) {
      tag = tag.toUpperCase();
      this.db.object(`articleData/tags/${tag}`)
        .take(1)
        .subscribe(data => {
          if (!data.$value)
            this.db.object(`articleData/tags/${tag}`).set(firebase.database.ServerValue.TIMESTAMP);
        });
      outputTagsObject[tag] = true;
    }
    tagsToProcess = tags;
  }

  isArticleFeatured(articleKey: string) {
    return this.db.object(`articleData/featuredArticles/${articleKey}`).map(res => {
      if (res.$value)
        return true;
      return false;
    });
  }
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

  // Deprecated - only here still for demonstration in case Chad wants to compare with new search pipe
  searchArticles(searchStr: string) {
    // Lowercase the search string so you can compared to lowercase titles and tags for cap sensitivity
    var searchRef = searchStr.toLowerCase();
    var foundArticles = new Array();
    // Iterate through all the articles
    this.getAllArticles().subscribe(articles => {
      articles.forEach(index => {
        // If the title contains the search string
        if (index.title.toLowerCase().includes(searchRef)) {
          // If the title contains the search string add the article to the array
          foundArticles.push(index);
        } else {
          for (var i = 0; i < Object.keys(index.tags).length; i++) {
            // If the title doesn't contain the string, iterate through the tags and check if the tags contain the search string
            if (Object.keys(index.tags)[i].toString().toLowerCase().includes(searchRef)) {
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
    return this.db.object(`userInfo/open/${authorKey}`);
  }

  // KYLE -> I'm adding the parameter articleId here. Use that instead of this.articleData.$key.
  //  The reason is that we won't be storing the id/key here. That will come from whatever component calls this function.
  navigateToArticleDetail(articleId: any) {
    //navigateToArticleDetail() {
    this.router.navigate([`articledetail/${articleId}`]);
    //this.router.navigate([`articledetail/${this.articleData.$key}`]);
  }

  navigateToAuthor(authorId: any) {
    this.router.navigate([`author/${authorId}`]);
  }
}
