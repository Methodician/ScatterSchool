import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Upload } from 'app/shared/class/upload';

@Component({
  selector: 'profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {
  @Input() uid;
  profileImageUrl;

  constructor(private uploadSvc: UploadService) { }

  ngOnInit() {
    this.getProfileImage(this.uid);
  }

  getProfileImage(uid) {
    const basePath = 'uploads/profileImages/';
    this.uploadSvc
      .getImage(uid, basePath)
      .subscribe(profileData => {
        if (profileData && profileData.url) {
          this.profileImageUrl = profileData.url;
        }
      });
  }
}

