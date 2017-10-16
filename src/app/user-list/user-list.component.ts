import { ChatService } from './../services/chat/chat.service';
import { UserInfoOpen } from './../services/user/user-info';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserService } from './../services/user/user.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @Input() userList;
  @Input() loggedInUser: UserInfoOpen;
  @Input() currentChat;
  @Output() requestSender = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  requestChat(userArray) {
    this.requestSender.emit(userArray);
  }
  
  isNotInCurrentChat(userKey) {
    return !this.currentChat.members[userKey];
  }  

  displayName(user) {
    return user.alias ? user.alias : user.fName;
  }

  calculateUnreadMessages(chat) {
    const totalMessages = chat.totalMessagesCount;
    const messagesSeen = chat.members[this.loggedInUser.$key].messagesSeenCount;
    return (totalMessages === messagesSeen) ? true : false;
  }
}
