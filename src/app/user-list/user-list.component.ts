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
  chatList;
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
    });
    this.chatSvc.getAllChats().subscribe(chatList => {
      this.chatList = chatList;
    });
  }

  displayName(user) {
    return user.alias ? user.alias : user.fName;
  }

  findChat(userKey) {
    return this.chatList.filter(chat => {
      return chat.members[userKey.$key] && chat.members[this.loggedInUser.$key]
    })[0];
  }

  createOrOpenChat(user) {
    let existingChat = this.findChat(user);
    (existingChat) ? this.openChat(existingChat.$key) : this.createChat(user);
  }

  openChat(chatKey){
    this.chatSvc.openChat(chatKey);
  }

  createChat(user) {
    let users = [];
    users.push(user, this.loggedInUser);
    this.chatSvc.createChat(users);
  }
}
