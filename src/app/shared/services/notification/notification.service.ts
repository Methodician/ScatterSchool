import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { UserInfoOpen } from '../../class/user-info';
import { UserService } from '../user/user.service'
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class NotificationService {
  userInfo: UserInfoOpen = null;

  constructor(
    private userSvc: UserService,
    private db: AngularFirestore,
    private rtdb: AngularFireDatabase) {
      this.userSvc.userInfo$.subscribe(userInfo => {
      if (userInfo.exists()) {
        this.userInfo = userInfo;
      }
    })
   }

   createFollowNotification(followerId: string, userId: string): void {
    const id = this.db.createId();
    const notification = {
      id: id,
      userId: userId,
      followerId: followerId,
      followerName: this.userInfo.displayName(),
      notificationType: "newFollower",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      timeViewed: null
    }  
    this.db.doc(`userData/${userId}/notifications/${id}`).set(notification);
  }

  getNewUserNotifications(userId: string): AngularFirestoreCollection<{}> {
    return this.db.collection(`userData/${userId}/notifications`, ref => ref.where('timeViewed', '==', null));
  }

  getAllUserNotifications(userId: string): AngularFirestoreCollection<{}> {
    return this.db.collection(`userData/${userId}/notifications`);
  }


  setNotificationsViewed(userId: string, notificationIds: string[]) {
    const batch = this.db.firestore.batch();
    for (const id of notificationIds) {
      batch.update(this.db.doc(`userData/${userId}/notifications/${id}`).ref, {timeViewed: firebase.firestore.FieldValue.serverTimestamp()})
    }
    batch.commit();
  }

  // kb: added this
  createFeatureNotification(authorId: string):void{
    const id = this.db.createId();
    const notification = {
      id: id,
      userId: authorId,
      followerId: null,
      followerName: null,
      notificationType: "articleFeature",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      timeViewed: null
    }  
    this.db.doc(`userData/${authorId}/notifications/${id}`).set(notification);
  }

  createEditNotification(authorId: string):void{
    const id = this.db.createId();
    const notification = {
      id: id,
      userId: authorId,
      followerId: null,
      followerName: null,
      notificationType: "articleEdit",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      timeViewed: null
    }  
    this.db.doc(`userData/${authorId}/notifications/${id}`).set(notification);
  }

  createNewArticleNotification(authorId: string):void{
    // returns list of followers
    var userFollowers = [];
    this.rtdb.list(`userInfo/followersPerUser/${authorId}`)
      .snapshotChanges()
      .subscribe(followers => {
        followers.map(follower =>{
          userFollowers.push(follower.key);
          // console.log(follower.payload.key, follower.payload.val());
        })
      });
    userFollowers.forEach(follower => {
      console.log("this user got notified", follower);
      this.notifyFollower(follower);
    })   
  }
  // really confusing.
  notifyFollower(followerId: string):void{
    const id = this.db.createId();
    const notification = {
      id: id,
      userId: followerId,
      followerId: null,
      followerName: null,
      notificationType: "followedAuthorNewArticle",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      timeViewed: null
    }  
    this.db.doc(`userData/${followerId}/notifications/${id}`).set(notification);
  }


}
