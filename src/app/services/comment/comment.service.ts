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
    this.makeUserAssociations(commentData.authorKey, dbSaveData.key);    
  }

  makeParentAssociation(parentKey, childCommentKey) {
    let association = {
      parentKey: parentKey,
      childCommentKey: childCommentKey
    }
    this.db.list('commentData/commentsPerParent').push(association);
  }

  makeUserAssociations(userKey, commentKey) {
    let association = {
      userKey: userKey,
      commentKey: commentKey
    }
    this.db.list('commentData/commentsPerUser').push(association);
  }
}
