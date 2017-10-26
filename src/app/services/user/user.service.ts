import { AuthInfo } from './../auth/auth-info';
import { UserInfoOpen } from './user-info';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
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
    return this.includeObjectMetadata(this.db.object(`presenceData/users/${userKey}`))
  }

  setUserAccess(accessLevel: number, uid: string) {
    return this.db.object(`userInfo/accessLevel/${uid}`).set(accessLevel);
  }

  createUser(userInfo, uid) {
    this.setUserAccess(10, uid);
    return this.db.object(`userInfo/open/${uid}`).set(userInfo);
  }

  getUserList() {
    return this.includeListMetadata(this.db.list('userInfo/open'));
  }

  getUserInfo(uid) {
    return this.includeObjectMetadata(this.db.object(`userInfo/open/${uid}`))
      .map(user => {
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
      .map(usersPerKey => {
         return usersPerKey.map((user: any) => {
          return this.includeObjectMetadata(this.db.object(`userInfo/open/${user.$key}`)).map(user => {
            return new UserInfoOpen(user.alias, user.fName, user.lName, user.zipCode, user.$key, user.$key, user.bio, user.city, user.state);
          })
        })
      })
      .flatMap(firebaseObjects =>
        Observable.combineLatest(firebaseObjects));
  }

  getUsersFollowed(uid: string): Observable<UserInfoOpen[]> {
    let usersFollowedKeysList = this.includeListMetadata(this.db.list(`userInfo/usersPerFollower/${uid}`));
    let usersFollowedObservable = this.UserArrayFromKeyArray(usersFollowedKeysList);
    return usersFollowedObservable;
  }

  getFollowersOfUser(uid: string): Observable<UserInfoOpen[]> {
    let followerKeysList = this.includeListMetadata(this.db.list(`userInfo/followersPerUser/${uid}`));
    let followersListObservable = this.UserArrayFromKeyArray(followerKeysList);
    return followersListObservable;
  }

  navigateToProfile(uid: any) {
    this.router.navigate([`profile/${uid}`]);
  }

  isFollowingUser(uid: string) {
    return this.includeObjectMetadata(this.db.object(`userInfo/usersPerFollower/${this.loggedInUserKey}/${uid}`)).map(res => {
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
    return this.includeObjectMetadata(this.db.object(`uploads/profileImages/${userKey}/url`));
  }

  includeObjectMetadata(objectRef: AngularFireObject<{}>) {
    return objectRef.snapshotChanges().map(action => {
      const $key = action.payload.key;
      const data = {
        $key, ...action.payload.val()
      }
      return data;
    })
  }

  includeListMetadata(listRef: AngularFireList<{}>) {
    return listRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const $key = action.payload.key;
        const data = {
          $key, ...action.payload.val()
        };
        return data;
      })
    });
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
