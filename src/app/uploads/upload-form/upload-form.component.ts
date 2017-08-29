import { AuthService } from 'app/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/upload/upload.service';
import { Upload } from '../../services/upload/upload';
import { FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})

export class UploadFormComponent implements OnInit {
  selectedFiles: FileList;
  currentUpload: Upload;
  upload;
  loggedInUserKey: any;

  constructor(
    private upSvc: UploadService,
    private authSvc: AuthService
    ) { }
 

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file);
    this.upSvc.pushUpload(this.currentUpload);
  }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(info => {
      if (info.$uid) {
        this.loggedInUserKey = info.$uid; 
        this.upSvc.getProfileImage(this.loggedInUserKey).subscribe(upload => {
          this.upload = upload;  
        })
      }
    })
  }
}


