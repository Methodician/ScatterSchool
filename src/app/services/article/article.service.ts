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
    return this.db.list('articleData/articles');
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

  createNewArticle(AuthorKey: string, article: any) {

    let bodyKey = this.db.list('articleData/articleBodies').push(article.body).key;
    let tagsObject = this.tagsObjectFromStringArray(article.tags);

    let articleToSave = {
      title: article.title,
      introduction: article.introduction,
      bodyKey: bodyKey,
      tags: tagsObject,
      version: 1,
      authorKey: AuthorKey,
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }

    let articleKey = this.db.list('articleData/articles').push(articleToSave).key;
    this.db.object(`articleData/articlesPerAuthor/${AuthorKey}/${articleKey}`).set(true);

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
    this.db.object(`articleData/articleBodies/${oldBodyKey}`).subscribe(body => {
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
    let articleToUpdate = {
      title: article.title,
      introduction: article.introduction,
      bodyKey: bodyKey,
      tags: tagsObject,
      version: article.version + 1,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    this.db.object(`articleData/editorsPerArticle/${articleKey}/${editorKey}`).set(true);
    this.db.object(`articleData/articlesPerEditor/${editorKey}/${articleKey}`).set(true);

    return this.db.object(`articleData/articles/${articleKey}`).update(articleToUpdate);
  }

  tagsArrayFromTagsObject(articleTags: {}): string[] {
    if (articleTags == {})
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

    for (let tag of newTags) {
      this.db.object(`articleData/articlesPerTag/${tag}/${articleKey}`).set(true);
      this.addGlobalTag(tag);
    }

    for (let tag of oldTags) {
      if (!newTags.includes(tag)) {
        deletedTags.push(tag);
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
        limitToLast: 7
      }
    }).map(articles => {
      articles.map(article => {
        article.tags = this.tagsArrayFromTagsObject(article.tags);
        return article;
      });
      return articles;
    });
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

  getAuthorByKey(authorKey: string) {
    return this.db.object(`userInfo/open/${authorKey}`);
  }

  navigateToArticleDetail(articleKey: any) {
    this.router.navigate([`articledetail/${articleKey}`]);
  }

  navigateToAuthor(authorKey: any) {
    this.router.navigate([`author/${authorKey}`]);
  }
}
