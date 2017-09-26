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
  currentChat;
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
      if(user) { 
        this.chatSvc.getChatsByUserKey(user.$key).subscribe(chatList => {
          this.chatList = chatList;
        });
      }
    });

    this.chatSvc.currentChatKey$.subscribe(key => {
      if(key) {
        this.chatSvc.getChatByKey(key).subscribe(chat => {
          this.currentChat = chat;
        })
      }
    });
  }

  isNotInCurrentChat(userKey) {
    return !this.currentChat.members[userKey];
  }

  addToChat(user, event) {
    event.stopPropagation();
    let users = Object.keys(this.currentChat.members).map(memberKey => {
      return {
        alias: this.currentChat.members[memberKey].name,
        $key: memberKey
      }
    });
    users.push(user);
    let existingChat = this.findChat(users)
    existingChat ? this.openChat(existingChat.$key) : this.createChat(users);
  }

  memberNames(chat) {
    return (<any>Object).values(chat.members).map(member => {return member.name}).join(', ');
  }

  displayName(user) {
    return user.alias ? user.alias : user.fName;
  }

  findChat(users) {
    if(!this.chatList) return false;
    return this.chatList.filter(chat => {
      return users.length === Object.keys(chat.members).length && users.every(user => chat.members[user.$key])
    })[0];
  }

  createOrOpenChat(users) {
    users.push(this.loggedInUser);
    let existingChat = this.findChat(users);
    (existingChat) ? this.openChat(existingChat.$key) : this.createChat(users);
  }

  openChat(chatKey){
    this.chatSvc.openChat(chatKey);
  }

  createChat(users) {
    this.chatSvc.createChat(users);
  }
}
