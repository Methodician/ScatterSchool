import { AuthInfo } from './auth-info';
import { Injectable, Inject } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserPresence } from './user-presence';


@Injectable()
export class AuthService {
  static UNKNOWN_USER = new AuthInfo(null);
  userPresence: UserPresence;
  user$: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null);
  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  constructor(
    private afAuth: AngularFireAuth,
    //@Inject(FirebaseRef) fbRef
  ) {
    this.afAuth.authState.subscribe(info => {
      if (info) {
        // console.log('AuthState from Auth Service constructor:', info);
        if(info.uid) this.setUserPresence(info.uid);
        this.user$.next(info);
        const authInfo = new AuthInfo(info.uid, info.emailVerified);
        this.authInfo$.next(authInfo);
      }
    });
  }

  setUserPresence(userKey) {
    let user = firebase.database().ref(`presenceData/users/${userKey}`);
    let connections = user.child('connections');
    let lastOnline = user.child("lastOnline");
    let connectionData = firebase.database().ref(`.info/connected`);

    connectionData.on('value', snapshot => {
      if(snapshot.val()) {
        let connection = connections.push();
        this.userPresence = new UserPresence(connection, lastOnline, userKey);
      }
    })
  }

  /*login(email, password): Observable<FirebaseAuthState> {
    return this.fromFirebaseAuthPromise(this.auth.login({ email, password }));
  }*/
  login(email, password) {
    return this.fromFirebaseAuthPromise(this.afAuth.auth.signInWithEmailAndPassword(email, password));
  }

  logout() {
    this.userPresence.cancelDisconnect();
    this.afAuth.auth.signOut();
    this.authInfo$.next(AuthService.UNKNOWN_USER);
    this.user$.next(null);
  }

  /*signUp(email, password): Observable<FirebaseAuthState> {
    return this.fromFirebaseAuthPromise(this.auth.createUser({ email, password }));
  }*/
  register(email, password) {
    return this.fromFirebaseAuthPromise(this.afAuth.auth.createUserWithEmailAndPassword(email, password));
  }
  setDisplayName(alias) { // (later create option by making args "(alias, user?)")
    //let userToSet = user || this.afAuth.auth.currentUser;
    let userToSet = this.afAuth.auth.currentUser;
    userToSet.updateProfile({ displayName: alias, photoURL: null });
  }

  fromFirebaseAuthPromise(promise): Observable<any> {
    const subject = new Subject<any>();

    promise
      .then(res => {
        console.log('Auth Service promise result:', res);
        this.afAuth.authState.subscribe(state => {
          console.log('Auth State:', state);
        });
        const authInfo = new AuthInfo(this.afAuth.auth.currentUser.uid, res.emailVerified);
        //const authInfo = new AuthInfo('figure out how to get uid', false);
        this.authInfo$.next(authInfo);
        subject.next(res);
        subject.complete();
      },
      err => {
        this.authInfo$.error(err);
        subject.error(err);
        subject.complete();
      });
    return subject.asObservable();
  }

  sendVerificationEmail() {
    let user = this.afAuth.auth.currentUser;
    console.log('afAuth.auth.currentUser:', user);
    user.sendEmailVerification().then(() => {
    }, (error) => {
      alert('It looks like your verification email was not sent. Please try again or contact support.');
    });
  }
}
