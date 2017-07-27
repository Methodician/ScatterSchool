import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoOpen } from './../services/user/user-info';
import { UserService } from './../services/user/user.service';
import { AuthService } from './../services/auth/auth.service';
import { AuthInfo } from './../services/auth/auth-info';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  authInfo: AuthInfo = new AuthInfo(null, false);
  displayName: string = '';

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService
  ) { }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(authInfo => {
      this.authInfo = authInfo;
    });
    this.userSvc.userInfo$.subscribe((userInfo: UserInfoOpen) => {
      if (userInfo && userInfo.$key) {
        this.displayName = userInfo.alias || userInfo.fName;
      }
    });
  }

  logout() {
    this.authSvc.logout();
  }

}
