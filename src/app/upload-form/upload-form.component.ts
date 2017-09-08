import { TopNavComponent } from './../top-nav/top-nav.component';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  selectedFiles: any;
  firebaseStorage = 'firebase.storage().ref().child(`uploads/articleCoverImages/${file.name}`)';

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadImageToStorage() {
    const file = this.selectedFiles[0];
    firebase.storage().ref().child(`uploads/articleCoverImages/${file.name}`).put(file)
    .catch(error => {
      console.log(error.message);
    });
  }

  saveImageDataToDatabase() {
    const file = this.selectedFiles[0];
    this.db.object(`uploads/articleCoverImages/${file.name}`).set(file)
    .catch(error => {
      console.log(error.message);
    });
  }
}
