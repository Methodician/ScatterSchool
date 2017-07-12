import { Router, ActivatedRoute } from '@angular/router';
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
    authSvc: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.loggedInUid = info.$uid;
      if (!this.userInfo)
        this.setUser();
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'])
        this.accountUid = params['id'];
      if (!this.userInfo)
        this.setUser();
    })
  }

  setUser() {
    if (this.accountUid || this.loggedInUid)
      this.getUserInfo(this.accountUid || this.loggedInUid);
  }

  getUserInfo(uid: string) {
    this.userSvc.getUserInfo(uid).subscribe(userInfo => {
      this.userInfo = userInfo;
    })
  }

}
