import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Upload } from './upload'
import { UserService } from "app/services/user/user.service";
import { AuthService } from "app/services/auth/auth.service";

@Injectable()
export class UploadService {
  constructor(
    private db: AngularFireDatabase,
    private userSvc: UserService,
    private authSvc: AuthService
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.loggedInUserKey = info.$uid;
    });
   } 
  basePath: string = 'uploads/profileImages/';
  loggedInUserKey: string;
  uploads: FirebaseListObservable<Upload[]>;
  listPath  = this.db.list(`${this.basePath}/${this.loggedInUserKey}/`);
  

  pushUpload(upload: Upload) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}/`).put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        let snap = snapshot as firebase.storage.UploadTaskSnapshot;
        upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100
      },
      (error) => {
        console.log(error);
      },
// save data and push to live database
      () => {
        let metaSnapShot = uploadTask.snapshot.metadata;
        upload.fullPath = metaSnapShot.bucket + '/' + metaSnapShot.fullPath;
        upload.uid = this.loggedInUserKey;
        upload.url = metaSnapShot.downloadURLs[0];
        upload.name = upload.file.name;
        upload.size = upload.file.size;
        upload.type = upload.file.type;
        upload.timeStamp = firebase.database.ServerValue.TIMESTAMP;
        upload.progress = null;
        this.saveFileData(upload);
        return undefined;
      }
    );
  }

  // to return a user's profile image
  getProfileImage(userKey) {
    return this.db.object(`${this.basePath}/${userKey}`);
  }

  // writes data to live database
  private saveFileData(upload: Upload) {
    this.db.object(`${this.basePath}/${this.loggedInUserKey}/`).set(upload)
  }

// delete files from database and storage
  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.$key)
    .then( () => {
      this.deleteFileStorage(upload.name);
    })
    .catch(error => console.log(error));
  }


// deletes from live database by key
  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/${this.loggedInUserKey}/`).remove(key);
  }

// deletes from storage by name
  private deleteFileStorage(name:string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete();
  }
}

