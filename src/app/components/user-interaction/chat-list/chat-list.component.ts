import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserInfoOpen } from 'app/shared/class/user-info';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  @Input() chatList;
  @Input() loggedInUser: UserInfoOpen;
  @Output() requestSender = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  requestChat(chatKey) {
    this.requestSender.emit(chatKey)
  }

  getMemberNames(chat) {
    let memberNames = "";
    for (let memberKey in chat.members) {
      if (memberKey != this.loggedInUser.$key) memberNames += `${chat.members[memberKey].name}, `;
    }
    return memberNames.substr(0, memberNames.length - 2);
  }

  calculateUnreadMessages(chat) {
    const totalMessages = chat.totalMessagesCount;
    const messagesSeen = chat.members[this.loggedInUser.$key].messagesSeenCount;
    return totalMessages === messagesSeen;
  }

  hasUnreadMessages(chat) {
    return chat.totalMessagesCount !== chat.members[this.loggedInUser.$key].messagesSeenCount;
  }

  unreadMessagesCount(chat) {
    return chat.totalMessagesCount - chat.members[this.loggedInUser.$key].messagesSeenCount;
  }

  userCount(chat) {
    return Object.keys(chat.members).length - 1;
  }
}
