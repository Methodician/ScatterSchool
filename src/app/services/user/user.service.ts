import { AuthInfo } from './../auth/auth-info';
import { UserInfoOpen } from './user-info';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  private NULL_USER = new UserInfoOpen(null, null, null, null)
  userInfo$: BehaviorSubject<UserInfoOpen> = new BehaviorSubject<UserInfoOpen>(this.NULL_USER);
  loggedInUserKey: string;
  uid;

  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase,
    private router: Router
  ) {
    this.authSvc.authInfo$.subscribe(authInfo => {
      this.getUserInfo(authInfo.$uid).subscribe(info => {
        if (info.$key != 'null') {
          let userInfo =  new UserInfoOpen(info.alias, info.fName, info.lName, info.zipCode, info.$key, info.uid, info.bio, info.city, info.state);
          this.userInfo$.next(userInfo);
          this.loggedInUserKey = info.$key;
        }
      })
    })
  }

  getUserPresence(userKey) {
    return this.db.object(`presenceData/users/${userKey}`)
  }

  setUserAccess(accessLevel: number, uid: string) {
    return this.db.object(`userInfo/accessLevel/${uid}`).set(accessLevel);
  }

  createUser(userInfo, uid) {
    this.setUserAccess(10, uid);
    return this.db.object(`userInfo/open/${uid}`).set(userInfo);
  }

  getUserList() {
    return this.db.list('userInfo/open');
  }

  getUserInfo(uid) {
    return this.db.object(`userInfo/open/${uid}`).map(user => {
      user.uid = uid;
      return user;
    })
  }

  updateUserInfo(userInfo, uid) {
    let detailsToUpdate = {
      alias: userInfo.alias,
      bio: userInfo.bio,
      city: userInfo.city,
      email: userInfo.email,
      fName: userInfo.fName,
      lName: userInfo.lName,
      state: userInfo.state,
      zipCode:userInfo.zipCode
    }
    this.db.object(`userInfo/open/${uid}`).update(detailsToUpdate)
  }

  followUser(userToFollowKey: string) {
    this.db.object(`userInfo/usersPerFollower/${this.loggedInUserKey}/${userToFollowKey}`).set(firebase.database.ServerValue.TIMESTAMP);
    this.db.object(`userInfo/followersPerUser/${userToFollowKey}/${this.loggedInUserKey}`).set(firebase.database.ServerValue.TIMESTAMP);
  }

  unfollowUser(userToUnfollowKey: string) {
    this.db.object(`userInfo/usersPerFollower/${this.loggedInUserKey}/${userToUnfollowKey}`).remove();
    this.db.object(`userInfo/followersPerUser/${userToUnfollowKey}/${this.loggedInUserKey}`).remove();
  }

  UserArrayFromKeyArray(userKeys: Observable<string[]>): Observable<UserInfoOpen[]> {
    return userKeys
      .map(usersPerKey =>
        usersPerKey.map((user: any) =>
          this.db.object(`userInfo/open/${user.$key}`).map(user => {
            user.uid = user.$key;
            return user;
          })))
      .flatMap(firebaseObjects =>
        Observable.combineLatest(firebaseObjects));
  }

  getUsersFollowed(uid: string): Observable<UserInfoOpen[]> {
    return this.UserArrayFromKeyArray(this.db.list(`userInfo/usersPerFollower/${uid}`));
  }

  getFollowersOfUser(uid: string): Observable<UserInfoOpen[]> {
    return this.UserArrayFromKeyArray(this.db.list(`userInfo/followersPerUser/${uid}`));
  }

  navigateToProfile(uid: any) {
    this.router.navigate([`profile/${uid}`]);
  }

  isFollowingUser(uid: string) {
    return this.db.object(`userInfo/usersPerFollower/${this.loggedInUserKey}/${uid}`).map(res => {
      if (res.$value) {
        return true;
      } return false;
    });
  }

  updateUser(userInfo, uid) {
    userInfo.uid = null;
    return this.db.object(`userInfo/open/${uid}`).set(userInfo);
  }

  getProfileImageUrl(userKey: string) {
    return this.db.object(`uploads/profileImages/${userKey}/url`);
  }

  /*isAdmin() {
    let sub = new Subject();
    this.authSvc.authInfo$.subscribe(info => {
      if (info.$uid) {
        this.db.object(`userInfo/accessLevel/${info.$uid}`).subscribe(accessLevel => {
          sub.next(accessLevel.$value >= 80);
          sub.complete();
        });
      }
    });
    return sub.asObservable();
  }*/

}
