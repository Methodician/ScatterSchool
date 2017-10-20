import { Component, OnInit, AfterContentChecked, ElementRef, ViewChild, Input } from '@angular/core';
import { ChatService } from '../services/chat/chat.service'
import { UserService } from './../services/user/user.service';
import { UserInfoOpen } from 'app/services/user/user-info';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messageList') private elementRef: ElementRef;
  @Input() loggedInUser: UserInfoOpen;
  newMessagesSeenCount: number;
  oldMessagesSeenCount = 0;
  messages;
  recipientKey: string = "";
  messagesSubscription;

  constructor(
    private chatSvc: ChatService,
    private userSvc: UserService
  ) { }
  
  ngOnInit() {   
    this.chatSvc.currentChatKey$.subscribe(key => {
      if (key) {
        if(this.messagesSubscription) this.messagesSubscription.unsubscribe();
        this.messagesSubscription = this.chatSvc.getMessagesByKey(key).subscribe(messages => {
          this.messages = messages;
          this.updateMessagesSeenAndTotalMessages(this.loggedInUser.$key, this.messages.length);
          this.chatSvc.getMessagesSeenCount(this.loggedInUser.$key).subscribe(messagesSeen => {            
            this.newMessagesSeenCount = messagesSeen.messagesSeenCount; 
          })
        });
      }
    })
    
  }

  ngAfterViewChecked() {
    if(this.oldMessagesSeenCount != this.newMessagesSeenCount) {
      this.oldMessagesSeenCount = this.newMessagesSeenCount;
      this.scrollToBottom();
    }

  }

  updateMessagesSeenAndTotalMessages(user, totalMessages) {
    this.chatSvc.updateMessagesSeenCount(user, totalMessages);
    this.chatSvc.updateTotalMessagesCount(totalMessages);
  }

  scrollToBottom() {
    this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
  }

  postMessage(chatForm) {
    if(chatForm.valid) {
      let message = {
        sentBy: this.loggedInUser.$key,
        authorName: this.loggedInUser.displayName(),
        body: chatForm.text
      }
      this.chatSvc.saveMessage(message);
      chatForm.clearForm();
    }
  }

  isOwnMessage(authorKey) {
    return this.loggedInUser && authorKey == this.loggedInUser.$key;
  }
}
