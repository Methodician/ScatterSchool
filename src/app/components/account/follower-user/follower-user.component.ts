import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'app/shared/services/user/user.service';
import { UserInfoOpen } from 'app/shared/class/user-info';


@Component({
  selector: 'follower-user',
  templateUrl: './follower-user.component.html',
  styleUrls: ['./follower-user.component.scss']
})
export class FollowerUserComponent implements OnInit {
  @Input() user: any;
  photoURL = '../../../../assets/images/kid-art.jpg';

  constructor(private userSvc: UserService) { }

  ngOnInit() {
    this.userSvc
      .getProfileImageUrl(this.user.uid)
      .valueChanges()
      .subscribe(url => {
        this.photoURL = url as string;
      })
  }

  navigateToProfile() {
    this.userSvc.navigateToProfile(this.user.uid);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }
}
