import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  selectedFiles: any;

  constructor() { }

  ngOnInit() {
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadImage() {
    const file = this.selectedFiles.item(0);
    console.log(file);
    console.log(this.selectedFiles);
    console.log(this.selectedFiles.item(0));
  }
}
