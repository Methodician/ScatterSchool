import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoOpen } from './../services/user/user-info';
import { AuthService } from './../services/auth/auth.service';
import { UserService } from './../services/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  loggedInUid: string;
  @Input() accountUid: string;
  userInfo: UserInfoOpen;
  form: FormGroup;

  constructor(
    private userSvc: UserService,
    authSvc: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.loggedInUid = info.$uid;
      if (!this.userInfo)
        this.setUser();
    });

    this.form = this.fb.group({
      email: ['', Validators.required],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      alias: '',
      bio: '',
      city: '',
      state: '',
      zipCode: ['', Validators.required]
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
  
  //from register component - import later?
  isErrorVisible(field: string, error: string) {
    let control = this.form.controls[field];
    return control.dirty && control.errors && control.errors[error];
  }

  isControlDirty(field: string) {
    let control = this.form.controls[field];
    return control.dirty;
  }

  formValid() {
    return this.form.valid;
  }

}
