import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Upload } from './upload'
import { UserService } from "app/services/user/user.service";
import { AuthService } from "app/services/auth/auth.service";

@Injectable()
export class UploadService { 
  basePath: string = 'uploads/profileImages';
  loggedInUserKey: string;
  uploads: FirebaseListObservable<Upload[]>;
  progress: number;
  constructor(
    private db: AngularFireDatabase,
    private userSvc: UserService,
    private authSvc: AuthService
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.loggedInUserKey = info.$uid;
    });
   }


  pushUpload(upload: Upload) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        let snap = snapshot as firebase.storage.UploadTaskSnapshot
        upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100
      },
      (error) => {
        console.log(error)
      },
// save data and push to live database
      () => {
        let metaSnapShot = uploadTask.snapshot.metadata
        // upload.timeStamp = firebase.database.ServerValue.TIMESTAMP
        upload.fullPath = metaSnapShot.bucket + '/' + metaSnapShot.fullPath
        upload.uid = this.loggedInUserKey
        upload.url = metaSnapShot.downloadURLs[0]
        upload.name = upload.file.name
        upload.size = upload.file.size
        upload.type = upload.file.type
        upload.progress = null
        this.saveFileData(upload)
        return upload
      }
    );
  }

  // to return all uploads
  getUploads(query={}) {
    this.uploads = this.db.list(this.basePath)
    console.log(this.uploads)
    return this.uploads
  }

// delete files from database and storage
  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.$key)
    .then( () => {
      this.deleteFileStorage(upload.name)
    })
    .catch(error => console.log(error))
  }

// writes data to live database
  private saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload).update({timestamp: firebase.database.ServerValue.TIMESTAMP});
  }

// deletes from live database by key
  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

// deletes from storage by name
  private deleteFileStorage(name:string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }
}


