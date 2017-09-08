import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Upload } from '../upload/upload';
import { UserService } from 'app/services/user/user.service';
import { AuthService } from 'app/services/auth/auth.service';

@Injectable()
export class ArticleCoverImgUploadService {
basePath = 'uploads/profileImages/';
loggedInUserKey: string;

constructor(private afd: AngularFireDatabase) { }

 uploadImage(upload: Upload) {
  const uploadTask = firebase.storage().ref().child(`uploads/articleCoverImages/${upload.name}`).put(upload.file);
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot) => {
      const snap = snapshot as firebase.storage.UploadTaskSnapshot;
      upload.url = snap.metadata.downloadURLs[0];
      upload.size = snap.metadata.size;
      upload.type = snap.metadata.contentType;
      upload.name = snap.metadata.name;
      upload.timeStamp = firebase.database.ServerValue.TIMESTAMP;
      this.saveImageData(upload);
    },
    (error) => {
      alert(error);
    }
  );
}

private saveImageData(upload: Upload) {
  this.afd.object(`uploads/articleCoverImages/`).set(upload)
  .catch(error => {
    console.log(error);
  });
}





}




 