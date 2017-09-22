import { ChatService } from './../services/chat/chat.service';
import { UserInfoOpen } from './../services/user/user-info';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user/user.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  userList;
  loggedInUser: UserInfoOpen;
  constructor(
    private userSvc: UserService,
    private chatSvc: ChatService
  ) { }

  ngOnInit() {
    this.userSvc.getUserList().subscribe(userList => {
      this.userList = userList;
    });
    this.userSvc.userInfo$.subscribe(user => {
      this.loggedInUser = user;
    })
  }

  displayName(user) {
    return user.alias ? user.alias : user.fName;
  }

  openChat(userKey) {
    let userKeys = [];
    userKeys.push(userKey);
    userKeys.push(this.loggedInUser.$key);
    this.chatSvc.openChat(userKeys);
  }
}
