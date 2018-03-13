import { element } from 'protractor';
import { Router } from '@angular/router';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { UserService } from 'app/shared/services/user/user.service';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { AuthInfo } from 'app/shared/class/auth-info';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  // @ViewChild('searchInput') searchInput;
  isCollapsed = true;
  userInfo: UserInfoOpen;
  authInfo: AuthInfo = new AuthInfo(null, false);
  displayName = '';
  scrollEvent: any;
  lastScrollY: number;
  lastScrollDirection = 'up';
  // searchInput: string;
  searchBarState: searchBarFocus = searchBarFocus.inactive;
  // kb
  // uid: string = '';

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private router: Router
  ) {
    window.onscroll = (event) => {
      this.scrollEvent = event;
      const currentScrollY = this.scrollEvent.path[1].scrollY;

      if (currentScrollY > this.lastScrollY) {
        this.lastScrollDirection = 'down';
      } else if (currentScrollY < this.lastScrollY) {
        this.lastScrollDirection = 'up';
      }
      this.lastScrollY = currentScrollY;
    }
  }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(authInfo => {
      this.authInfo = authInfo;
    });
    this.userSvc.userInfo$.subscribe((userInfo: UserInfoOpen) => {
      if (userInfo.exists()) {
        this.userInfo = userInfo;
        this.displayName = userInfo.alias || userInfo.fName;
        // kb
        // console.log("in top nav, userinfo uid", userInfo.uid);
        // this.uid = userInfo.uid;
      }
    });
  }

  search(input: any) {
    this.router.navigate([`articlesearch/${input.value}`]);
    input.value = '';
    this.searchBarState = searchBarFocus.inactive;
  }

  logout() {
    this.authSvc.logout();
  }

  lastScrolledUp() {
    return this.lastScrollDirection === 'up' ? true : false;
  }

  searchBarFocus(input?: any) {
    if (input.value.length === 0) {
      if (this.searchBarState === searchBarFocus.focus) {
        return this.searchBarState = searchBarFocus.inactive;
      } else if (this.searchBarState === searchBarFocus.inactive) {
        setTimeout(() => {
          input.focus();
        }, 100);
        return this.searchBarState = searchBarFocus.focus;
      }
    } else {
      this.search(input);
    }
  }
}

export enum searchBarFocus {
  'focus' = 1,
  'inactive'
}
