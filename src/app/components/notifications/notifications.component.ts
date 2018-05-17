import { Component, OnInit, Input, OnChanges, trigger, state, style, transition, animate } from '@angular/core';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { UserService } from '../../shared/services/user/user.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { Router } from '@angular/router';
import { Timestamp } from '@firebase/firestore-types';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('notificationState', [ 
      state('disappear', style({transform: 'translateY(-700px)'})),
      state('appear', style({transform: 'translateY(0)'})),
      transition( 'disappear <=> appear', animate('675ms ease-in'))
    ])
  ]
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
  usernames: {};
  notificationState: string = 'disappear';

  constructor(
    private notificationSvc: NotificationService,
    private userSvc: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      if (userInfo.exists()) {
        this.userSvc
          .getUserNames()
          .valueChanges()
          .subscribe(usernames => {
            this.usernames = usernames;
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
              })
      }
    });
  }

  toggleNotificationsModal(){
    this.notificationHistoryVisible = false;
    if(this.notificationsModalVisible) {
      this.notificationsModalVisible = false;
      this.notificationState = 'disappear';
    // } else if(this.notifications.length > 0){
    } else {
      this.notificationsModalVisible = true;
      this.notificationState = 'appear';
    }
  }

  markNotificationRead(notificationId: string) {
    // if this notificiation is selected then set a timestamp to time viewed
    if(notificationId){
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

    this.router.navigate([`profile/${followerId}`]);
  }

  navigateToArticleDetail(articleId:string):void {
    this.router.navigate([`articledetail/${articleId}`]);
  }

  navigateToArticleHistory(articleId:string):void{
    this.router.navigate([`articlehistory/${articleId}`]);
  }

  formatDate(timestamp: any) {
    // console.log("what is this ", typeof timestamp, " ", timestamp, " ", new Date(timestamp));
    timestamp = timestamp.toDate();
    
    let dd = timestamp.getDate();
    let mm = timestamp.getMonth()+1;
    let yyyy = timestamp.getFullYear();
    let hh = timestamp.getHours();
    let m = timestamp.getMinutes();
    if (m < 10) {
      let formattedDate = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':0' + m;
      return formattedDate;
    }
    let formattedDate = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + m;
    return formattedDate;
  }

}


