import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat/chat.service'
import { UserService } from './../services/user/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // @Input() recipientKey;
  messages;
  currentUserInfo;
  recipientKey: string = "";

  constructor(
    private chatSvc: ChatService,
    private userSvc: UserService
  ) { }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      this.currentUserInfo = userInfo;
    });

    this.chatSvc.getAllMessages().subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage(message) {
    let authorName = this.currentUserInfo.alias ? this.currentUserInfo.alias : this.currentUserInfo.fName;
    let messageData = {
      authorKey: this.currentUserInfo.$key,
      authorName: authorName,
      recipientKey: this.recipientKey,
      text: message,
    }
    this.chatSvc.saveMessage(messageData);
  }

  isOwnMessage(authorKey) {
    return this.currentUserInfo && authorKey == this.currentUserInfo.$key;
  }
}
