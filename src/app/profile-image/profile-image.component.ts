import { AuthInfo } from './../services/auth/auth-info';
import { AuthService } from 'app/services/auth/auth.service';
import { UserService } from './../services/user/user.service';
import { UploadService } from './../services/upload/upload.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {
  profileImageUrl: any;
  uid;
  userName;
  userAlias;


  constructor(
    private uploadSvc: UploadService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
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
}





