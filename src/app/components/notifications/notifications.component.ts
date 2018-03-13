import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { UserService } from '../../shared/services/user/user.service';
import { NotificationService } from '../../shared/services/notification/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  // @Input() uid;
  notifications: {}[];
  notificationsModalVisible:boolean = false;
  recentModalVisible:boolean = false;
  mostRecentNotifId:string = '';
  //uid: string;

  constructor(
    private notificationSvc: NotificationService
  ) { }

  ngOnInit() {
    // this.userSvc.userInfo$.subscribe((userInfo: UserInfoOpen) => {
    //  this.uid = userInfo.uid;

    //  if(userInfo.exists()) {
    //   this.userSvc
    //   .getNewUserNotifications(this.uid)
    //   .valueChanges()
    //   .subscribe(notifications => {
    //     this.notifications = notifications;
    //     console.log('notifications: ', notifications);
    //     console.log('most recent notification', notifications[0]);
    //     this.showMostRecentNotification(notifications);
    //     });
    //   }

    // });
    if (this.notificationSvc.userInfo.uid)
    {
      this.notificationSvc
        .getNewUserNotifications(this.notificationSvc.userInfo.uid)
        .valueChanges()
        .subscribe(notifications => {
          this.notifications = notifications;
        })
    }
  }

  toggleNotificationsModal(){
    if(this.notificationsModalVisible) {
      let notifArray: string[]= [];
      this.notifications.forEach(function(n){
        notifArray.push(n['id']);
      });
      this.notificationSvc.setNotificationsViewed(this.notificationSvc.userInfo.uid, notifArray);
      this.notificationsModalVisible = false;
    } else if(this.notifications.length > 0){
      this.notificationsModalVisible = true;
    }
  }

  // showMostRecentNotification(notifications:{}[]) {
  //   if (notifications.length > 0 && this.mostRecentNotifId != notifications[0]['id']){
  //     this.recentModalVisible = true;
  //     this.mostRecentNotifId = notifications[0]['id'];
  //     setTimeout(()=> {
  //       this.recentModalVisible = false;
  //     }, 3000)
  //   }  
  // }

  // marknotificationsRead() {
  //   const ids = this.notifications.map(notification => {
  //     return notification.Id;
  //   })

  // }
}


