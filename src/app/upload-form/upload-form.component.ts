import { ArticleService } from './../services/article/article.service';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { UploadService } from './../services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Upload } from '../services/upload/upload';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  selectedFiles: any;
  @Input() articleKey;
  @Input() uid;

  constructor(
    private upSvc: UploadService
  ) { }

  ngOnInit() {
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  setBasePath(articleKey, uid) {
    if (this.articleKey) {
      const basePath = 'uploads/articleCoverImages';
      const key = this.articleKey.articleKey;
      this.sendImgToUploadSvc(key, basePath);
    } else {
      const key = this.uid.uid;
      const basePath = 'uploads/profileImages/';
      this.sendImgToUploadSvc(key, basePath);
    }
  }

  sendImgToUploadSvc(key, basePath) {
    const file = this.selectedFiles.item(0);
    const currentUpload = new Upload(file);
    this.upSvc.uploadImage(currentUpload, key, basePath);
  }
}


 