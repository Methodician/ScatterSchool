import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/upload/upload.service';
import { Upload } from '../../services/upload/upload';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
  providers: [ UploadService ]
})

export class UploadFormComponent implements OnInit {
  // user = firebase.auth().currentUser;
  selectedFiles: FileList;
  currentUpload: Upload;
  uploads: FirebaseListObservable<Upload[]>;

  constructor(
    private upSvc: UploadService) { }
 

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file);
    this.upSvc.pushUpload(this.currentUpload)
  }

  ngOnInit() {
    this.uploads = this.upSvc.getUploads()
    this.uploads.subscribe()
  }
}


