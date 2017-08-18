import { Component, OnInit, Input } from '@angular/core';
import { UserService } from './../services/user/user.service';

@Component({
  selector: 'follow-btn',
  templateUrl: './follow-btn.component.html',
  styleUrls: ['./follow-btn.component.scss']
})
export class FollowBtnComponent implements OnInit {

  @Input() uid: string;
  buttonText = 'Follow';
  isFollowing = false;

  constructor(
    private userSvc: UserService
  ) { 
    
    }

  ngOnInit() {
    console.log(this.uid);
    this.checkIfFollowing();
  }

  click() {
    if (this.isFollowing) {
      this.userSvc.unfollowUser(this.uid);
    }
    else
      this.userSvc.followUser(this.uid);
  }

  isFollowingUser() {
    return this.userSvc.isFollowingUser(this.uid);
  }

  checkIfFollowing() {
    this.userSvc.isFollowingUser(this.uid).subscribe(following => {
      if (following) {
        this.buttonText = 'Unfollow';
        this.isFollowing = true;
      }
      else {
        this.buttonText = 'Follow';
        this.isFollowing = false;
      }
    });
  }

}
