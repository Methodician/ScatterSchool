import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoOpen } from './../services/user/user-info';
import { AuthService } from './../services/auth/auth.service';
import { UserService } from './../services/user/user.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {
  loggedInUserKey: string;
  @Input() accountUserKey: string;
  userInfo: UserInfoOpen;
  form: FormGroup;

  constructor(
    private userSvc: UserService,
    private authSvc: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
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

    authSvc.authInfo$.subscribe(info => {
      this.loggedInUserKey = info.$uid;
      if (!this.userInfo) {
        this.setUser();
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['key']) {
        this.accountUserKey = params['key'];
      }
      if (!this.userInfo) {
        this.setUser();
      }
    });
  }

  setUser() {
    if (this.accountUserKey || this.loggedInUserKey) {
      this.getUserInfo(this.accountUserKey || this.loggedInUserKey);
    }
  }

  getUserInfo(uid: string) {
    this.userSvc.getUserInfo(uid).subscribe(userInfo => {
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
    this.userSvc.updateUser(userValues, userValues.uid).then(() => {
      alert('Your changes have been saved!')
    }, (error) => {
      alert(error);
    });
    this.router.navigateByUrl('/account');
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


