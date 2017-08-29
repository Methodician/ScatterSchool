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
      text: commentData.text,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }

    let dbSaveData = this.db.list('commentData/comments').push(commentToSave);
    
    this.makeParentAssociation(commentData.parentKey, dbSaveData.key);
    this.makeUserAssociation(commentData.authorKey, dbSaveData.key);    
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
