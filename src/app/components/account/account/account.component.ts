import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { UserService } from 'app/shared/services/user/user.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {
  @Input() accountUserKey: string;
  loggedInUserKey: string;
  userInfo: UserInfoOpen;
  form: FormGroup;

  constructor(
    private userSvc: UserService,
    private authSvc: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      alias: ['', Validators.maxLength(20)],
      bio: '',
      city: '',
      state: '',
      zipCode: ['', Validators.required],
      uid: ''
    });
    this.authSvc.authInfo$.subscribe(info => {
      this.loggedInUserKey = info.$uid;
      console.log("this is the logged in user key", this.loggedInUserKey);
      if (!this.userInfo) {
        this.setUser();
      }
    });
    this.route.params.subscribe(params => {
      if (params['key']) {
        this.accountUserKey = params['key'];
      }
      if (!this.userInfo) {
        this.setUser();
      }
    });
    console.log("this is the userinfo", this.userInfo);
  }

  updateAccountDetails() {
    this.userSvc.updateUserInfo(this.form.value, this.userInfo.uid);
  }


  setUser() {
    if (this.accountUserKey || this.loggedInUserKey) {
      this.getUserInfo(this.accountUserKey || this.loggedInUserKey);
    }
  }

  getUserInfo(uid: string) {
    this.userSvc
      .getUserInfo(uid)
      .subscribe(userInfo => {
        this.userInfo = userInfo;
        this.form.patchValue(userInfo);
      });
  }

  // from register component - service later?
  isErrorVisible(field: string, error: string) {
    const control = this.form.controls[field];
    return control.dirty && control.errors && control.errors[error];
  }

  isControlDirty(field: string) {
    const control = this.form.controls[field];
    return control.dirty;
  }

  formValid() {
    return this.form.valid;
  }

  updateSettings(userInfo) {
    const userValues = userInfo._value;
    this.userSvc.updateUser(userValues, userValues.uid);
    alert('Your changes have been saved!');
  } catch(error) {
    alert(error);
  }
}

  /*   ngOnChanges(changes: SimpleChanges) {
  //  Must make sure form is initalized before checking...
  if (changes['initialValue'] && changes['initialValue'].currentValue) {
    console.log(changes);
    // We have two methods to set a form's value: setValue and patchValue.
    this.form.patchValue(changes['initialValue'].currentValue);
  }
} */


