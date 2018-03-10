import { Component, OnInit } from '@angular/core';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: {}[];
  uid: string;

  constructor(private userSvc: UserService) { }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe((userInfo: UserInfoOpen) => {
     this.uid = userInfo.uid;

     if(userInfo.exists()) {
      this.userSvc
      .getUserNotifications(this.uid)
      .valueChanges()
      .subscribe(notifications => {
        this.notifications = notifications;
        console.log('notifications: ', notifications);
        });
      }
    });
  }

}


