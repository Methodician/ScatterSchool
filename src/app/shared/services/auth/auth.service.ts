import { Router } from '@angular/router';
import { AuthInfo } from '../../class/auth-info';
import { UserPresence } from '../../class/user-presence';
import { Injectable, Inject } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthService {
  static UNKNOWN_USER = new AuthInfo(null);
  userPresence: UserPresence;
  user$: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null);
  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private router: Router
    // @Inject(FirebaseRef) fbRef
  ) {
    this.afAuth.authState.subscribe(info => {
      if (info) {
        if (info.uid) { this.setUserPresence(info.uid) };
        this.user$.next(info);
        const authInfo = new AuthInfo(info.uid, info.emailVerified);
        this.authInfo$.next(authInfo);
      }
    });
  }

  setUserPresence(userKey) {
    const connectionData = this.afDatabase
      .database
      .ref(`.info/connected`);
    const user = this.afDatabase
      .database
      .ref(`presenceData/users/${userKey}`);
    const connections = user.child('connections');
    const lastOnline = user.child('lastOnline');

    connectionData.on('value', snapshot => {
      if (snapshot.val()) {
        const connection = connections.push();
        this.userPresence = new UserPresence(connection, lastOnline, userKey);
      }
    });
  }

  login(email, password) {
    const userPromise = this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          alert('Please enter the correct password.');
        } else if (error.code === 'auth/user-not-found') {
          alert(`We don't have any record of a user with that email address.`)
        } else {
          alert(error.message);
        }
      });
    return this.fromFirebaseAuthPromise(userPromise);
  }

  logout() {
    this.userPresence.cancelDisconnect();
    this.afAuth.auth.signOut();
    this.authInfo$.next(AuthService.UNKNOWN_USER);
    this.user$.next(null);
    location.reload();
  }

  /*signUp(email, password): Observable<FirebaseAuthState> {
    return this.fromFirebaseAuthPromise(this.auth.createUser({ email, password }));
  }*/
  register(email, password) {
    const userPromise = this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/weak-password') {
          alert('Your password should be stronger.');
        } else {
          alert(error.message);
        }
      });
    return this.fromFirebaseAuthPromise(userPromise);
  }

  // later create option by making args "(alias, user?)"
  setDisplayName(alias) {
    const userToSet = this.afAuth.auth.currentUser;
    userToSet.updateProfile({
      displayName: alias,
      photoURL: null
    });
  }

  // contains both auth creation and promise resolution state updates
  // candidate for refactor
  fromFirebaseAuthPromise(promise: Promise<any>): Observable<any> {
    const subject = new Subject<any>();
    promise.then(res => {
      const authInfo = new AuthInfo(this.afAuth.auth.currentUser.uid, res.emailVerified);
      this.authInfo$.next(authInfo);
      subject.next(res);
      subject.complete();
    }, err => {
      this.authInfo$.error(err);
      subject.error(err);
      subject.complete();
    });
    return subject.asObservable();
  }

  async sendVerificationEmail() {
    const user = this.afAuth.auth.currentUser;
    try {
      await user.sendEmailVerification();
    } catch (err) {
      alert('It looks like your verification email was not sent. Please try again or contact support.' + err);
    }
  }

  // candidate for refactor
  // may unnecessarily double-check user's logged in state
  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState
      .map(info => !!(info && info.uid)) // verifies user is logged in
      .take(1)
      .do(allowed => {
        if ( !allowed && confirm('You must be logged in to do that. Would you like to be redirected?')) {
          this.router.navigate(['/login']);
        }
      });
  }

  //  Doesn't really work, still needs to be an observable unless we want to keep a running isLoggedIn variable around.
  // checkIfLoggedIn() {
  //   this.isLoggedIn().subscribe(isLoggedIn => {
  //     return isLoggedIn;
  //   })
  // }
}
