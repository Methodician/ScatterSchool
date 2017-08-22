import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Upload } from './upload'

@Injectable()
export class UploadService {

  constructor(private db: AngularFireDatabase) { }

  private basePath:string = 'uploads';
  uploads: FirebaseListObservable<Upload[]>;

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
        upload.url = metaSnapShot.downloadURLs[0]
        upload.timeStamp = metaSnapShot.timeCreated
        upload.fullPath = metaSnapShot.bucket + '/' + metaSnapShot.fullPath
        upload.lastUpdated = metaSnapShot.updated
        upload.name = upload.file.name
        this.saveFileData(upload)
        return undefined
      }
    );
  }
 

// delete files from database and storage
  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.$key)
    .then( () => {
      this.deleteFileStorage(upload.name)
    })
    .catch(error => console.log(error))
  }

// writes to live database
  private saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload);
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


