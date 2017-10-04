import { Component, OnInit, OnChanges } from '@angular/core';
import { ChatService } from '../services/chat/chat.service'
import { UserService } from './../services/user/user.service';
 
@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  // @Input() recipientKey;
  messages;
  currentUserInfo;
  recipientKey: string = "";
  messagesSubscription;
  //currentChatKey: string;

  constructor(
    private chatSvc: ChatService,
    private userSvc: UserService
  ) { }
  
  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      this.currentUserInfo = userInfo;
    });      
    this.chatSvc.currentChatKey$.subscribe(key => {
      if (key) {
        if(this.messagesSubscription) this.messagesSubscription.unsubscribe();
        this.messagesSubscription = this.chatSvc.getMessagesByKey(key).subscribe(messages => {
          this.messages = messages;
          this.updateMessagesSeenAndTotalMessages(this.currentUserInfo.$key, this.messages.length)
        });
      }
    })
    
  }

  updateMessagesSeenAndTotalMessages(user, totalMessages) {
    this.chatSvc.updateMessagesSeenCount(user, totalMessages);
    this.chatSvc.updateTotalMessagesCount(totalMessages);
  }

  niceScroll() {
      document.getElementById('message-list').scrollTop = document.getElementById('message-list').scrollHeight;
  }

  sendMessage(message) {
    let authorName = this.currentUserInfo.alias ? this.currentUserInfo.alias : this.currentUserInfo.fName;
    let messageData = {
      sentBy: this.currentUserInfo.$key,
      authorName: authorName,
      //recipientKey: this.recipientKey,
      body: message.text,
    }
    this.chatSvc.saveMessage(messageData);
    message.clearForm();
    this.niceScroll();
  }

  isOwnMessage(authorKey) {
    return this.currentUserInfo && authorKey == this.currentUserInfo.$key;
  }
}
