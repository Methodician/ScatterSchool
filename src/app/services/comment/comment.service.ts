import { Router, Params } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class CommentService {

  constructor(
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  saveComment(commentData) {
    let commentToSave = {
      authorKey: commentData.authorKey,
      parentKey: commentData.parentKey,
      text: commentData.text,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    }

    let dbSaveData = this.db.list('commentData/comments').push(commentToSave);
    
    this.makeParentAssociation(commentData.parentKey, dbSaveData.key);
    this.makeUserAssociation(commentData.authorKey, dbSaveData.key);
    this.makeParentTypeAssociation(commentData.parentType, commentData.parentKey, dbSaveData.key);
    this.makeCommentsPerArticleAssociation(commentData.parentKey, dbSaveData.key);
  }

  makeParentTypeAssociation(parentType, parentKey, childKey) {
    if (parentType === 'article') this.makeCommentsPerArticleAssociation(parentKey, childKey);
    if (parentType === 'comment') this.makeRepliesPerCommentAssociation(parentKey, childKey);
  }

  makeRepliesPerCommentAssociation(parentCommentKey, replyCommentKey) {
    this.db.object(`commentData/repliesPerComment/${parentCommentKey}/${replyCommentKey}`).set(true);
  }

  getCommentsByParentKey(parentKey) {
    return this.db.list(`commentData/comments`, {query: {
      orderByChild: 'parentKey',
      equalTo: parentKey
    }});
  }

  makeCommentsPerArticleAssociation(articleKey, childCommentKey) {
    this.db.object(`commentData/commentsPerArticle/${articleKey}/${childCommentKey}`).set(true);
  }

  makeParentAssociation(parentKey, childCommentKey) {
    this.db.object(`commentData/commentsPerParent/${parentKey}/${childCommentKey}`).set(true);
  }

  makeUserAssociation(userKey, commentKey) {
    this.db.object(`commentData/commentsPerUser/${userKey}/${commentKey}`).set(true);
  }

  getAllComments() {
    return this.db.list(`commentData/comments`)
  }
}
