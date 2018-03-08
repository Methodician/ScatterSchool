import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: {}[];

  constructor(private userSvc: UserService) { }

  ngOnInit() {
    this.userSvc
      .getNotifications()
      .valueChanges()
      .subscribe(notifications => {
        this.notifications = notifications;
        console.log('notifications: ', notifications);
      })
  }

}
