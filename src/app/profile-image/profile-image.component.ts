import { AuthService } from 'app/services/auth/auth.service';
import { UploadService } from './../services/upload/upload.service';
import { Component, OnInit } from '@angular/core';
import { Upload } from './../services/upload/upload';


@Component({
  selector: 'profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {
  selectedFiles;
  uid;
  profileImageUrl;

  constructor(
    private uploadSvc: UploadService,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(info => {
      this.uid = info.$uid;
      this.getProfileImage(this.uid);
    });
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
    console.log(event);
  }

  uploadImage() {
    const file = this.selectedFiles.item(0);
    const currentUpload = new Upload(file);
    this.uploadSvc.pushUpload(currentUpload);
    console.log(currentUpload);
  }
}
