import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Upload } from '../../class/upload';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UploadService {

  constructor(private afd: AngularFireDatabase) { }

  // tutorial on the uploadImage method can be found here:
  // https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
  // and here https://firebase.google.com/docs/storage/web/upload-files
  // and a good explanation of uploadTask.on here:
  // https://firebase.google.com/docs/reference/js/firebase.storage.UploadTask


  uploadImage(upload: Upload, key, basePath) {
    // delete old file from storage
    if (upload.url) {
      this.deleteFileStorage(key, basePath);
    };
    // put new file in storage
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${basePath}/${key}`).put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      // watch upload progress
      (snapshot) => {
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100;
      },
      // upload failed
      (error) => {
        alert(error.message);
      },
      // upload success
      () => {
        const snap = uploadTask.snapshot;
        upload.url = snap.metadata.downloadURLs[0];
        upload.size = snap.metadata.size;
        upload.type = snap.metadata.contentType;
        upload.name = snap.metadata.name;
        upload.timeStamp = firebase.database.ServerValue.TIMESTAMP;
        upload.progress = null;
        // save metadata to live database
        this.saveImageData(upload, key, basePath);
        // alert('success!');
        return undefined;
      }
    );
  }

  // writes metadata to live database
  private saveImageData(upload: Upload, key, basePath) {
    if (basePath === 'uploads/profileImages/') {
      this.updateUserData(upload, key);
    }
    this.afd.object(`${basePath}/${key}`).set(upload)
      .catch(error => {
        console.log(error);
      });
  }

  // update public user data with new profile photo url
  private updateUserData(upload: Upload, key: string): void {
    this.afd
      .object(`userInfo/usernames/${key}`)
      .update({
        photoURL: upload.url
      });
  }

  // delete files form firebase storage
  private deleteFileStorage(key, basePath) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${basePath}/${key}`).delete();
  }

  // return an image from the database
  getImage(key, basePath) {
    return this.afd
      .object(`${basePath}/${key}`)
      .valueChanges() as any;
  }
}




