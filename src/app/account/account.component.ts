import { UserInfoOpen } from './../services/user/user-info';
import { AuthService } from './../services/auth/auth.service';
import { UserService } from './../services/user/user.service';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  loggedInUid: string;
  @Input() accountUid: string;
  userInfo: UserInfoOpen

  constructor(
    private userSvc: UserService,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(info => {
      this.loggedInUid = info.$uid;
      this.getUserInfo(this.accountUid || this.loggedInUid);
    })
  }

  getUserInfo(uid: string) {
    this.userSvc.getUserInfo(uid).subscribe(userInfo => {
      this.userInfo = userInfo;
    })
  }

}
