import { ArticleService } from 'app/shared/services/article/article.service';
import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Upload } from 'app/shared/class/upload';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  // Test Code for a possible loading animation
  // color = 'primary';
  // mode = 'indeterminate';
  // test: boolean;
  currentUpload: Upload;
  selectedFiles: any;
  @Input() articleKey;
  @Input() uid;

  constructor(
    private upSvc: UploadService,
    private router: Router,
    private articleSvc: ArticleService
  ) { }

  ngOnInit() { }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
    return this.selectedFiles;
  }

  setBasePath() {
    // this.test = true;
    if (this.articleKey) {
      const basePath = 'uploads/articleCoverImages';
      this.sendImgToUploadSvc(this.articleKey, basePath);
    } else {
      const basePath = 'uploads/profileImages/';
      this.sendImgToUploadSvc(this.uid, basePath);
    }
  }

  sendImgToUploadSvc(key, basePath) {
    const file = this.selectedFiles.item(0);
    this.currentUpload = new Upload(file);
    this.upSvc.uploadImage(this.currentUpload, key, basePath);
  }
}



