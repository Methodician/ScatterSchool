import { AuthInfo } from '../../class/auth-info';
import { UserInfoOpen } from '../../class/user-info';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
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
    private rtdb: AngularFireDatabase,
    private router: Router
  ) {
    this.authSvc.authInfo$.subscribe(authInfo => {
      this
        .getUserInfo(authInfo.$uid)
        .subscribe(info => {
          if (info.$key !== 'null') {
            const userInfo = new UserInfoOpen(
              info.alias,
              info.fName,
              info.lName,
              info.zipCode,
              info.$key,
              info.uid,
              info.bio,
              info.city,
              info.state
            );
            this.userInfo$.next(userInfo);
            this.loggedInUserKey = info.$key;
          }
        })
    })
  }

  getUserPresence(userKey) {
    return this.rtdb.object(`presenceData/users/${userKey}`);
  }

  setUserAccess(accessLevel: number, uid: string) {
    return this.rtdb
      .object(`userInfo/accessLevel/${uid}`)
      .set(accessLevel);
  }

  createUser(userInfo, uid) {
    this.setUserAccess(10, uid);
    this.updateUserNames(userInfo);
    return this.rtdb
      .object(`userInfo/open/${uid}`)
      .set(userInfo);
  }

  getUserList() {
    return this.injectListKeys(this.rtdb.list('userInfo/open'));
  }

  getUserInfo(uid) {
    const object = this.injectObjectKey(this.rtdb.object(`userInfo/open/${uid}`));
    return object
      .map(user => {
        user.uid = uid;
        return user;
      });
  }

  updateUserInfo(userInfo, uid) {
    const detailsToUpdate = {
      alias: userInfo.alias,
      bio: userInfo.bio,
      city: userInfo.city,
      email: userInfo.email,
      fName: userInfo.fName,
      lName: userInfo.lName,
      state: userInfo.state,
      zipCode: userInfo.zipCode
    }
    this.rtdb
      .object(`userInfo/open/${uid}`)
      .update(detailsToUpdate);
    this.updateUserNames(userInfo);
  }

  followUser(userToFollowKey: string) {
    this.rtdb
      .object(`userInfo/usersPerFollower/${this.loggedInUserKey}/${userToFollowKey}`)
      .set(firebase.database.ServerValue.TIMESTAMP);
    this.rtdb
      .object(`userInfo/followersPerUser/${userToFollowKey}/${this.loggedInUserKey}`)
      .set(firebase.database.ServerValue.TIMESTAMP);
  }

  unfollowUser(userToUnfollowKey: string) {
    this.rtdb
      .object(`userInfo/usersPerFollower/${this.loggedInUserKey}/${userToUnfollowKey}`)
      .remove();
    this.rtdb
      .object(`userInfo/followersPerUser/${userToUnfollowKey}/${this.loggedInUserKey}`)
      .remove();
  }

  UserArrayFromKeyArray(userKeys: Observable<string[]>): Observable<UserInfoOpen[]> {
    return userKeys
      .map(usersPerKey => {
        return usersPerKey.map((keyUser: any) => {
          const object = this.injectObjectKey(this.rtdb.object(`userInfo/open/${keyUser.$key}`));
          return object
            .map(user => {
              return new UserInfoOpen(
                user.alias,
                user.fName,
                user.lName,
                user.zipCode,
                user.$key,
                user.$key,
                user.bio,
                user.city,
                user.state
              );
          })
        })
      })
      .flatMap(firebaseObjects => {
        return Observable.combineLatest(firebaseObjects)
      });
  }

  getUsersFollowed(uid: string): Observable<UserInfoOpen[]> {
    const usersFollowedKeysList = this.injectListKeys(this.rtdb.list(`userInfo/usersPerFollower/${uid}`));
    const usersFollowedObservable = this.UserArrayFromKeyArray(usersFollowedKeysList);
    return usersFollowedObservable;
  }

  getFollowersOfUser(uid: string): Observable<UserInfoOpen[]> {
    const followerKeysList = this.injectListKeys(this.rtdb.list(`userInfo/followersPerUser/${uid}`));
    const followersListObservable = this.UserArrayFromKeyArray(followerKeysList);
    return followersListObservable;
  }

  navigateToProfile(uid: any) {
    this.router.navigate([`profile/${uid}`]);
  }

  isFollowingUser(uid: string) {
    return this.rtdb
      .object(`userInfo/usersPerFollower/${this.loggedInUserKey}/${uid}`)
      .valueChanges()
      .map(res => {
        return !!res;
      });
  }

  updateUser(userInfo, uid) {
    userInfo.uid = null;
    this.rtdb
      .object(`userInfo/open/${uid}`)
      .set(userInfo);
    this.updateUserNames(userInfo);
  }

  getProfileImageUrl(userKey: string) {
    return this.rtdb.object(`uploads/profileImages/${userKey}/url`);
  }

  injectObjectKey(object: AngularFireObject<{}>) {
    return object
      .snapshotChanges()
      .map(element => {
        return {
          $key: element.key,
          ...element.payload.val()
        };
      });
  }

  injectListKeys(list: AngularFireList<{}>) {
    return list
      .snapshotChanges()
      .map(elements => {
        return elements.map(element => {
          return {
            $key: element.key,
            ...element.payload.val()
          };
        });
      });
  }

  updateUserNames(user: UserInfoOpen){
    console.log('updating user: ', user);
    const name = user.alias ? user.alias : user.fName;
    this.rtdb
      .object(`userInfo/usernames`)
      .update({
        [`${user.$key}`]: name
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
