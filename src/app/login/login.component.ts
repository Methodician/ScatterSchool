import { AuthInfo } from './../services/auth/auth-info';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { UserService } from './../services/user/user.service';
import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  authInfo: AuthInfo;

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0)
  }

  login() {
    const val = this.form.value;

    this.authSvc.login(val.email, val.password)
      .subscribe(
      res => {
        //console.log('Login result from LoginComp:', res);
        delete val.password;
        //this.userSvc.getUserInfo(res.uid).subscribe(res => console.log);
        this.router.navigateByUrl('/account');
      },
      err => alert(err)
      );
  }

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

}
