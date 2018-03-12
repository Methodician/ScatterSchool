import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnChanges {
  @Input() uid;
  notifications: {}[];
  notificationsModalVisible:boolean = false;
  recentModalVisible:boolean = false;
  mostRecentNotifId:string = '';
  //uid: string;

  constructor(private userSvc: UserService) { }

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
  }

  ngOnChanges(){
    console.log("uid this has an input now", this.uid);
    if (!!this.uid){
      this.userSvc
        .getNewUserNotifications(this.uid)
        .valueChanges()
        .subscribe(notifications => {
          this.notifications = notifications;
          // this.showMostRecentNotification(notifications);
          console.log('notifications: ', notifications);
          console.log('most recent notification', notifications[0]);
        });
    }
  }

  toggleNotificationsModal(){
    if(this.notificationsModalVisible) {
      let notifArray: string[]= [];
      this.notifications.forEach(function(n){
        notifArray.push(n['id']);
      });
      this.userSvc.setNotificationsViewed(this.uid, notifArray);
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


