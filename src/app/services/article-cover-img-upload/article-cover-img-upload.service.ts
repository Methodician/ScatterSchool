import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Upload } from '../upload/upload';
import { UserService } from 'app/services/user/user.service';
import { AuthService } from 'app/services/auth/auth.service';

@Injectable()
export class ArticleCoverImgUploadService {
constructor(private afd: AngularFireDatabase) { }

  uploadImage(upload: Upload, key, basePath) {
    console.log(upload);
    console.log(key);
    console.log(basePath);
    if (upload.url) {
      this.deleteFileStorage(key, basePath);
    };
    const uploadTask = firebase.storage().ref().child(`${basePath}/${key}`).put(upload.file);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        upload.url = snap.metadata.downloadURLs[0];
        upload.size = snap.metadata.size;
        upload.type = snap.metadata.contentType;
        upload.name = snap.metadata.name;
        upload.timeStamp = firebase.database.ServerValue.TIMESTAMP;
        this.saveImageData(upload, key, basePath);
        alert('success!');
      },
      (error) => {
        alert(error);
      }
    );
  }

  private saveImageData(upload: Upload, key, basePath) {
    this.afd.object(`${basePath}/${key}`).set(upload)
    .catch(error => {
      console.log(error);
    });
  }

  // deletes from storage by name
  private deleteFileStorage(key, basePath) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${basePath}/${key}`).delete();
  }
}




 