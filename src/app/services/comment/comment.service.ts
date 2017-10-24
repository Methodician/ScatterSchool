import { Router, Params } from '@angular/router';
import { AngularFireDatabase as AngularFireDatabase5 } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class CommentService {

  constructor(
    private db: AngularFireDatabase5,
    private router: Router
  ) {}

  saveComment(commentData) {
    let commentToSave = {
      authorKey: commentData.authorKey,
      parentKey: commentData.parentKey,
      parentType: commentData.parentType,
      text: commentData.text,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP,
      commentCount: 0
    }
    let dbSaveData = this.db.list('commentData/comments').push(commentToSave);
  }
  // comment count functionality temporarily removed. will move to cloud function 
  // this could be replaced with an enum
  // getBasePathByParentType(parentType) {
  //   switch(parentType) {
  //     case "comment":
  //       return "commentData/comments/"
  //     case "article":
  //       return "articleData/articles/"
  //     default:
  //       return false;
  //   }
  // }

  // updateCommentCount(parentKey, parentType, value) {
  //   let parentPath = this.getBasePathByParentType(parentType) + parentKey;

  //   this.db.object(parentPath).$ref.ref.transaction(parent => {
  //     if (parent) {
  //       // logic is verbose, but accounts for current data/data added which has not comment count
  //       if (parent.commentCount) parent.commentCount += value;
  //       else if (value == 1) parent.commentCount = 1;
  //       else if (value == -1) parent.commentCount = 0; 
  //       if(parentType == "comment") this.updateCommentCount(parent.parentKey, parent.parentType, value);
  //     }
  //     return parent;
  //   });    
  // }

  updateComment(newCommentData) {
    let commentDataToUpdate = {
      text: newCommentData.text,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }
    this.db.object(`commentData/comments/${newCommentData.key}`).update(commentDataToUpdate)
  }

  deleteComment(comment) {
    this.db.object(`commentData/comments/${comment.$key}`).update({isDeleted: true});
    // this.updateCommentCount(comment.parentKey, comment.parentType, -1);
  }

  getAllComments() {
    return this.db.list(`commentData/comments`).snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const $key = action.payload.key;
        const data = {
          $key, ...action.payload.val()
        };
        return data;
      })
    })
  }

  getCommentsByParentKey(parentKey) {
    return this.db.list(`commentData/comments`, ref => {
      return ref.orderByChild('parentKey').equalTo(parentKey)
    }).snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const $key = action.payload.key;
          const data = {
            $key, ...action.payload.val()
          };
          return data;
        })
      })
  }
}
