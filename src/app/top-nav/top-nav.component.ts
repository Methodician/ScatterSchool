import { UserInfoOpen } from './../services/user/user-info';
import { UserService } from './../services/user/user.service';
import { AuthService } from './../services/auth/auth.service';
import { AuthInfo } from './../services/auth/auth-info';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  isCollapsed: boolean = true;

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
