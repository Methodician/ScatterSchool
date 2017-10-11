import { ArticleDetailOpen } from './article-info';
import { Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
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
    return this.db.list('articleData/articles').map(articles => {
      return articles.map(article => {
        article.tags = this.tagsArrayFromTagsObject(article.tags);
        return article;
      });
    });
  }

  getArticleByKey(articleKey: string) {
    return this.db.object(`articleData/articles/${articleKey}`).map(article => {
      article.tags = this.tagsArrayFromTagsObject(article.tags);
      return article;
    });
  }

  getArticleBodyByKey(bodyKey: string) {
    return this.db.object('articleData/articleBodies/' + bodyKey);
  }

  findArticlesForKeys(articleKeys$: Observable<any[]>): Observable<ArticleDetailOpen[]> {
    return articleKeys$
      .map(articlesPerKey => articlesPerKey
        .map(article =>
          this.db.object(`articleData/articles/${article.$key}`)
            .map(article => {
              article.tags = this.tagsArrayFromTagsObject(article.tags);
              return article;
            })))
      .flatMap(firebaseObjects =>
        Observable.combineLatest(firebaseObjects));
  }

  findArticlesPerEditor(editorKey: string): Observable<ArticleDetailOpen[]> {
    return this.findArticlesForKeys(this.db.list(`articleData/articlesPerEditor/${editorKey}`));
  }

  findArticlesPerAuthor(authorKey: string): Observable<ArticleDetailOpen[]> {
    return this.findArticlesForKeys(this.db.list(`articleData/articlesPerAuthor/${authorKey}`));
  }

  getArticleBodyFromArchiveByKey(bodyKey: string) {
    return this.db.object(`articleData/articleBodyArchive/${bodyKey}/body`)
  }

  getArticleHistoryByKey(articleKey: string) {
    return this.db.list(`articleData/articleArchive/${articleKey}`)
      .map(articles => {
        return articles.map(article => {
          article.tags = this.tagsArrayFromTagsObject(article.tags);
          return article;
        })
      });
  }
  //  Failed attempt to do full mapping in service:
  /* getAllArticleHistory(articleKey: string) {
    return this.db.list(`articleData/articleArchive/${articleKey}`)
      .map(articles => articles
        .map(article => {
          this.getArticleBodyByKey(article.bodyKey)
            .map(body => {
              article.body = body;
              return article;
            });
        })
      //return articles;
      ).flatMap(firebaseObjects =>
        Observable.combineLatest(firebaseObjects));
  } */

  createNewArticle(authorKey: string, article: any) {

    let bodyKey = this.db.list('articleData/articleBodies').push(article.body).key;
    let tagsObject = this.tagsObjectFromStringArray(article.tags);

    let articleToSave = {
      title: article.title,
      introduction: article.introduction,
      bodyKey: bodyKey,
      tags: tagsObject,
      version: 1,
      authorKey: authorKey,
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }

    let articleKey = this.db.list('articleData/articles').push(articleToSave).key;
    this.db.object(`articleData/articlesPerAuthor/${authorKey}/${articleKey}`).set(true);

    let tags = article.tags;
    if (tags) {
      for (let tag of tags) {
        this.db.object(`articleData/articlesPerTag/${tag}/${articleKey}`).set(true);
        this.addGlobalTag(tag);
      }
    }
    return articleKey;
  }

  updateArticle(editorKey: string, article: any) {
    const oldBodyKey = article.bodyKey;
    const articleKey = article.articleKey;
    let tagsObject = this.tagsObjectFromStringArray(article.tags);

    //  Really wanted to reduce trips to the db...
    this.db.object(`articleData/articles/${articleKey}/tags`)
      .map(tags => this.tagsArrayFromTagsObject(tags))
      .subscribe(oldTags => {
        if ((article.tags && article.tags != []) || (oldTags && oldTags != [])) {
          this.processTagsEdit(article.tags, oldTags, articleKey);
        }
      });

    this.archiveArticle(articleKey);
    this.db.object(`articleData/articleBodies/${oldBodyKey}`)
      .take(1).subscribe(body => {
        let bodyLogObject: any = {};
        bodyLogObject.body = body.$value;
        bodyLogObject.articleKey = articleKey;
        bodyLogObject.version = article.version;
        bodyLogObject.nextEditorKey = editorKey;
        this.db.object(`articleData/articleBodyArchive/${oldBodyKey}`).set(bodyLogObject).then(res => {
          this.db.object(`articleData/articleBodies/${oldBodyKey}`).remove();
        });
        this.db.object(`articleData/bodysPerArticle/${articleKey}/${oldBodyKey}`).set(firebase.database.ServerValue.TIMESTAMP);
      });
    let bodyKey = this.db.list('articleData/articleBodies').push(article.body).key;
    let currentLogObject = {
      body: article.body,
      articleKey: null,
      version: 'current',
      nextEditorKey: null
    };
    this.db.object(`articleData/articleBodyArchive/${bodyKey}`).set(currentLogObject);
    let articleToUpdate: any = {
      title: article.title,
      introduction: article.introduction,
      bodyKey: bodyKey,
      tags: tagsObject,
      version: article.version + 1,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    this.db.object(`articleData/editorsPerArticle/${articleKey}/${editorKey}`).set(true);
    this.db.object(`articleData/articlesPerEditor/${editorKey}/${articleKey}`).set(true);
    articleToUpdate.authorKey = article.authorKey;
    this.db.object(`articleData/articleArchive/${articleKey}/current`).set(articleToUpdate);

    return this.db.object(`articleData/articles/${articleKey}`).update(articleToUpdate);
  }

  tagsArrayFromTagsObject(articleTags): string[] {
    if (articleTags == {} || (articleTags && articleTags.$value && articleTags.$value == null))
      return null;

    let tagArray = [];
    for (let tag in articleTags) {
      tagArray.push(tag);
    }
    return tagArray;
  }

  tagsObjectFromStringArray(tagsArray: string[]): object {
    if (!tagsArray || tagsArray == [])
      return null;

    let tagsObject = {};
    for (let tag of tagsArray) {
      tagsObject[tag.toUpperCase()] = true;
    }

    return tagsObject;
  }

  addGlobalTag(tag: string) {
    this.db.object(`articleData/tags/${tag}`).take(1).subscribe(data => {
      if (!data.$key)
        this.db.object(`articleData/tags/${tag}`).set(firebase.database.ServerValue.TIMESTAMP);
    });
  }

  processTagsEdit(newTags, oldTags, articleKey) {
    let deletedTags = [];

    if (newTags) {
      for (let tag of newTags) {
        this.db.object(`articleData/articlesPerTag/${tag}/${articleKey}`).set(true);
        this.addGlobalTag(tag);
      }
    }

    if (oldTags && (oldTags && oldTags.$value && oldTags.$value != null)) {
      for (let tag of oldTags) {
        if (!newTags.includes(tag)) {
          deletedTags.push(tag);
        }
      }
    }

    for (let tag of deletedTags) {
      this.db.object(`articleData/articlesPerTag/${tag}/${articleKey}`).remove();
    }

  }

  archiveArticle(articleKey) {
    this.db.object(`articleData/articles/${articleKey}`).take(1).subscribe(article => {
      this.db.object(`articleData/articleArchive/${articleKey}/${article.version}`).set(article);
    });
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
    return this.findArticlesForKeys(this.db.list('articleData/featuredArticles'));
  }

  getLatest() {
    return this.db.list('articleData/articles', {
      query: {
        orderByChild: 'timeStamp',
        limitToLast: 12
      }
    }).map(articles => {
      articles.map(article => {
        article.tags = this.tagsArrayFromTagsObject(article.tags);
        return article;
      });
      return articles;
    });
  }

  getAuthorByKey(authorKey: string) {
    return this.db.object(`userInfo/open/${authorKey}`);
  }
  
  // ------------------------------------  
  bookmarkArticle(userKey, articleKey) {
    this.db.object(`userInfo/articleBookmarksPerUser/${userKey}/${articleKey}`).set(firebase.database.ServerValue.TIMESTAMP);
    this.db.object(`articleData/userBookmarksPerArticle/${articleKey}/${userKey}`).set(firebase.database.ServerValue.TIMESTAMP);
  }

  unBookmarkArticle(userKey, articleKey) {
    this.db.object(`userInfo/articleBookmarksPerUser/${userKey}/${articleKey}`).remove();
    this.db.object(`articleData/userBookmarksPerArticle/${articleKey}/${userKey}`).remove();
  }

//returns each article a user has bookmarked
  getBookmarksByUserKey(userKey) {
    return this.db.list(`userInfo/articleBookmarksPerUser/${userKey}`)
      .map(bookmark => {
        return bookmark.map(article => this.db.object(`articleData/articles/${article.$key}`));
      })
      .flatMap(firebaseObjectObservables => {
        return Observable.combineLatest(firebaseObjectObservables)
      });
  }

//returns each user that has bookmarked an article
  getUsersByArticleKey(articleKey) {
    return this.db.list(`articleData/userBookmarksPerArticle/${articleKey}`)
    .map(article => {
      console.log(article);
      return article.map(user => this.db.object(`userInfo/open/${user.$key}`));
    })
    .flatMap(FirebaseObjectObservable => {
      return Observable.combineLatest(FirebaseObjectObservable)
    });
  }
// ------------------------------------

  navigateToArticleDetail(articleKey: any) {
    this.router.navigate([`articledetail/${articleKey}`]);
  }

  navigateToProfile(uid: any) {
    this.router.navigate([`profile/${uid}`]);
  }
}
