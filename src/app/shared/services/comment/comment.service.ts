import { Router, Params } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable()
export class CommentService {

  constructor(
    private db: AngularFireDatabase,
    private router: Router
  ) { }

  saveComment(commentData) {
    const commentToSave = {
      authorKey: commentData.authorKey,
      parentKey: commentData.parentKey,
      parentType: commentData.parentType,
      text: commentData.text,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP,
      commentCount: 0
    }
    this.db.list('commentData/comments').push(commentToSave);
    // this.updateCommentCount(commentData.parentKey, commentData.parentType, 1);
  }

  // this could be replaced with an enum
  getBasePathByParentType(parentType) {
    switch (parentType) {
      case 'comment':
        return 'commentData/comments/'
      case 'article':
        return 'articleData/articles/'
      default:
        return false;
    }
  }

  updateCommentCount(parentKey, parentType, value) {
    const parentPath = this.getBasePathByParentType(parentType) + parentKey;
    this.db.object(parentPath).query.ref.ref.transaction(parent => {
      if (parent) {
        // logic is verbose, but accounts for current data/data added which has not comment count
        if (parent.commentCount) {
          parent.commentCount += value;
        } else if (value === 1) {
          parent.commentCount = 1;
        } else if (value === -1) {
          parent.commentCount = 0;
        }
        if (parentType === 'comment') {
          this.updateCommentCount(parent.parentKey, parent.parentType, value);
        }
      }
      return parent;
    });
  }

  updateComment(newCommentData) {
    const commentDataToUpdate = {
      text: newCommentData.text,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    this.db
      .object(`commentData/comments/${newCommentData.key}`)
      .update(commentDataToUpdate);
  }

  deleteComment(comment) {
    this.db
      .object(`commentData/comments/${comment.$key}`)
      .update({ isDeleted: true });
    this.updateCommentCount(comment.parentKey, comment.parentType, -1);
  }

  getAllComments() {
    return this.db.list(`commentData/comments`);
  }

  getCommentsByParentKey(parentKey: string) {
    const list = this.db.list(`commentData/comments`, ref => {
      return ref
        .orderByChild('parentKey')
        .equalTo(parentKey);
    });
    return this.injectKey(list);
  }

  injectKey(list: AngularFireList<{}>) {
    return list
      .snapshotChanges()
      .pipe(map(elements => {
        return elements.map(element => {
          return {
            $key: element.key,
            ...element.payload.val()
          };
        });
      }));
  }
}
