import { FirebaseObjectObservable } from 'angularfire2/database';
import { UploadService } from './../services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Upload } from '../services/upload/upload';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  currentUpload: Upload;
  selectedFiles: any;
  @Input() article;
  @Input() uid;

  constructor(
    private upSvc: UploadService,
    private router: Router
  ) { }

  ngOnInit() { }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  setBasePath() {
    if (this.article) {
      const key = this.article.articleKey;
      const basePath = 'uploads/articleCoverImages';
      this.sendImgToUploadSvc(key, basePath);
    } else {
      const key = this.uid;
      const basePath = 'uploads/profileImages/';
      this.sendImgToUploadSvc(key, basePath);
    }
  }

  sendImgToUploadSvc(key, basePath) {
    const file = this.selectedFiles.item(0);
    this.currentUpload = new Upload(file);
    console.log(this.currentUpload);
    console.log(this.currentUpload.progress);
    this.upSvc.uploadImage(this.currentUpload, key, basePath);
  }
}



