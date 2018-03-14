import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { UserService } from '../../shared/services/user/user.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  // @Input() uid;
  notifications: {}[];
  notificationHistory: {}[];
  // ininitializes notification history as not visible
  notificationHistoryVisible:boolean = false;
  notificationsModalVisible:boolean = false;
  mostRecentNotifId:string = '';
  //uid: string;

  constructor(
    private notificationSvc: NotificationService,
    private userSvc: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      if (userInfo.exists()) {
        this.notificationSvc
          .getNewUserNotifications(userInfo.uid)
          // .getNotificationHistory(userInfo.uid)
          .valueChanges()
          .subscribe(notifications => {
            this.notifications = notifications;
          });

        this.notificationSvc
          .getNotificationHistory(userInfo.uid)
          .valueChanges()
          .subscribe(notifications => {
            this.notificationHistory = notifications;
          });
      }
    });
  }

  toggleNotificationsModal(){
    this.notificationHistoryVisible = false;
    if(this.notificationsModalVisible) {
      this.notificationsModalVisible = false;
    // } else if(this.notifications.length > 0){
    } else {
      this.notificationsModalVisible = true;
    }
  }

  markNotificationRead(notificationId: string) {
    // if this notificiation is selected then set a timestamp to time viewed
    if(notificationId){
      console.log("notifId ", notificationId);
      this.notificationSvc.setNotificationViewed(this.notificationSvc.userInfo.uid, notificationId);
    }
  }

  markAllNotificationsRead() {
    let notifArray: string[]= [];
      this.notifications.forEach(function(n){
        notifArray.push(n['id']);
      });
      this.notificationSvc.setAllNotificationsViewed(this.notificationSvc.userInfo.uid, notifArray);
  }

  navigateToProfile(followerId:string):void {
    console.log("this is the follower:", followerId);
    this.router.navigate([`profile/${followerId}`]);
  }

}


