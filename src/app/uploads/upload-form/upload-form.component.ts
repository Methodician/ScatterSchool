import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/upload/upload.service';
import { Upload } from '../../services/upload/upload';



@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
  providers: [ UploadService ]
})

export class UploadFormComponent implements OnInit {
  selectedFiles: FileList;
  currentUpload: Upload;

  constructor(private upSvc: UploadService) { }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file);
    this.upSvc.pushUpload(this.currentUpload)
  }

  ngOnInit() {
  }

}
