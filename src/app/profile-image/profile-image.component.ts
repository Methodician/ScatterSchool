import { UploadService } from './../services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Upload } from './../services/upload/upload';

@Component({
  selector: 'profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {
  @Input() uid;
  selectedFiles;
  profileImageUrl;
  input;

  constructor( private uploadSvc: UploadService ) { }

  ngOnInit() {
    this.getProfileImage(this.uid);
  }

  getProfileImage(uid) {
    this.uploadSvc.getProfileImage(uid).subscribe(profileData => {
      if (profileData.url) {
        this.profileImageUrl = profileData.url;
      }
    });
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadImage() {
    const file = this.selectedFiles.item(0);
    const currentUpload = new Upload(file);
    this.uploadSvc.pushUpload(currentUpload);
  }
}
