import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { AuthInfo } from 'app/shared/class/auth-info';
import { UserService } from 'app/shared/services/user/user.service';
import { AuthService } from 'app/shared/services/auth/auth.service';

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
