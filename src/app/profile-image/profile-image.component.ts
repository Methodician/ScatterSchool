import { AuthInfo } from './../services/auth/auth-info';
import { AuthService } from 'app/services/auth/auth.service';
import { UserService } from './../services/user/user.service';
import { UploadService } from './../services/upload/upload.service';
import { Component, OnInit } from '@angular/core';
import { Upload } from './../services/upload/upload';


@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {
  selectedFiles;

  constructor(
    private uploadSvc: UploadService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.authSvc.authInfo$.subscribe(info => {
      const uid = info.$uid;
      this.getProfileImage(uid);
    });
  }

  getProfileImage(uid) {
    this.uploadSvc.getProfileImage(uid).subscribe(profileData => {
      if (profileData.url) {
        const profileImageUrl = profileData.url;
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





