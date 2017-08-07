import { UserInfoOpen } from './user-info';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

  userInfo$: BehaviorSubject<UserInfoOpen> = new BehaviorSubject<UserInfoOpen>(null);
  loggedInUserId: string;

  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase,
    private router: Router
  ) {
    this.authSvc.authInfo$.subscribe(authInfo => {
      this.getUserInfo(authInfo.$uid).subscribe(info => {
        if (info.$key != "null") {
          //info.$uid = info.$key;
          this.userInfo$.next(info);
          this.loggedInUserId = info.$key;
        }
      })
    })
  }

  setUserAccess(rank: number, uid: string) {
    return this.db.object(`userInfo/rank/${uid}`).set(rank);
  }

  createUser(userInfo, uid) {
    this.setUserAccess(2, uid);
    return this.db.object(`userInfo/open/${uid}`).set(userInfo);
  }

  getUserList() {
    return this.db.list('userInfo/open');
  }

  getUserInfo(uid) {
    return this.db.object(`userInfo/open/${uid}`).map( user => {
      user.uid = uid;
      return user;
    })
  }

  followUser(followedUserId: string) {
    let followingAuthorId = this.loggedInUserId;
    this.db.object(`userInfo/usersFollowed/${followingAuthorId}/${followedUserId}`).set(firebase.database.ServerValue.TIMESTAMP);
    this.db.object(`userInfo/followersPerUser/${followedUserId}/${followingAuthorId}`).set(firebase.database.ServerValue.TIMESTAMP);
    console.log('service worked');
  }

  unfollowUser (followedUserId: string) {
    let followingAuthorId = this.loggedInUserId;
    this.db.object(`userInfo/usersFollowed/${followingAuthorId}/${followedUserId}`).remove();
    this.db.object(`userInfo/followersPerUser/${followedUserId}/${followingAuthorId}`).remove();
    console.log('unfollow service worked');
  }

  findUsersForKeys(userIds$: Observable<string[]>): Observable<UserInfoOpen[]> {
    return userIds$
      .map(usersPerKey =>
        usersPerKey.map((user: any) =>
          this.db.object(`userInfo/open/${user.$key}`).map(user => {
            user.uid = user.$key;
            return user;
          })))
      .flatMap(firebaseObjects =>
        Observable.combineLatest(firebaseObjects));
  }

  // getAuthor(uid: string): Observable<UserInfoOpen[]> {
  //   return this.findUsersForKeys(this.db.list(`userInfo/open/${uid}`));
  // }

  getAuthorsFollowed(uid: string): Observable<UserInfoOpen[]> {
    return this.findUsersForKeys(this.db.list(`userInfo/usersFollowed/${uid}`));
  }

  getFollowingUsers(uid: string): Observable<UserInfoOpen[]> {
    return this.findUsersForKeys(this.db.list(`userInfo/followersPerUser/${uid}`));
  }

  navigateToUser(uid: any) {
    this.router.navigate([`author/${uid}`]);
  }

  isFollowingUser(uid: string) {
    return this.db.object(`userInfo/usersFollowed/${this.loggedInUserId}/${uid}`).map(res => {
      if (res.$value)
        return true;
      return false;
    });
  }

  /*isAdmin() {
    let sub = new Subject();
    this.authSvc.authInfo$.subscribe(info => {
      if (info.$uid) {
        this.db.object(`userInfo/rank/${info.$uid}`).subscribe(rank => {
          sub.next(rank.$value >= 80);
          sub.complete();
        });
      }
    });
    return sub.asObservable();
  }*/

}
