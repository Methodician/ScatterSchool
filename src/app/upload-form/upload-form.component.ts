import { ArticleCoverImgUploadService } from './../services/article-cover-img-upload/article-cover-img-upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Upload } from '../services/upload/upload';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  selectedFiles: any;
  // @Input() articleData: any;

  constructor(
    private aCISvc: ArticleCoverImgUploadService
  ) { }

  ngOnInit() {
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  sendImgToUploadSvc() {
    const file = this.selectedFiles.item(0);
    const currentUpload = new Upload(file);
    this.aCISvc.uploadImage(currentUpload);
  }
}

