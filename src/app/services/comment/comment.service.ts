import { Router, Params } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
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
      parentType: commentData.parentType,
      text: commentData.text,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    let dbSaveData = this.db.list('commentData/comments').push(commentToSave);
  }

  updateComment(newCommentData) {
    let commentDataToUpdate = {
      text: newCommentData.text,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    this.db.object(`commentData/comments/${newCommentData.key}`).update(commentDataToUpdate)
  }

  deleteComment(commentKey) {
    this.db.object(`commentData/comments/${commentKey}`).update({ isDeleted: true });
  }

  getAllComments() {
    return this.db.list(`commentData/comments`)
  }

  getCommentsByParentKey(parentKey) {
    return this.db.list(`commentData/comments`, {
      query: {
        orderByChild: 'parentKey',
        equalTo: parentKey
      }
    });
  }

}
