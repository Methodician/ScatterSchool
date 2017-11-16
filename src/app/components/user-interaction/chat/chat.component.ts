import { Component, OnInit, AfterContentChecked, ElementRef, ViewChild, Input } from '@angular/core';
import { ChatService } from 'app/shared/services/chat/chat.service'
import { UserService } from 'app/shared/services/user/user.service';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { LogService } from "app/services/log/log.service";

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messageList') private elementRef: ElementRef;
  @Input() loggedInUser: UserInfoOpen;
  @Input() totalMessages: number;
  newMessagesSeenCount: number;
  oldMessagesSeenCount = 0;
  messages;
  recipientKey: string = "";
  messagesSubscription;

  constructor(
    private chatSvc: ChatService,
    private userSvc: UserService,
    private logSvc: LogService
  ) { }

  ngOnInit() {
    let initLog = {
      timestamp: this.logSvc.makeFbTimestamp(),
      currentChatKeyBackCount: 0,
      shouldUpdateSeenCount: 0,
      updateSeenCount: 0
    };
    this.chatSvc.currentChatKey$.subscribe(key => {
      initLog.currentChatKeyBackCount += 1;
      console.log(initLog);
      const initKey = this.logSvc.getChatCompInitKey();
      this.logSvc.updateChatCompInitLog(initLog, initKey);
      if (key) {
        if (this.messagesSubscription) this.messagesSubscription.unsubscribe();
        this.messagesSubscription = this.chatSvc.getMessagesByKey(key).subscribe(messages => {
          this.messages = messages;
          //this.updateMessagesSeenAndTotalMessages(this.loggedInUser.$key, this.messages.length);
          this.chatSvc.getMessagesSeenCount(this.loggedInUser.$key).subscribe(messagesSeen => {
            this.newMessagesSeenCount = messagesSeen.messagesSeenCount;
            // This gets called a million times...
            this.chatSvc.shouldUpdateSeenCount$.subscribe(iShould => {
              //  this gets called repeatedly...
              initLog.shouldUpdateSeenCount += 1;
              this.logSvc.updateChatCompInitLog(initLog, initKey);
              if (iShould) {
                initLog.updateSeenCount += 1;
                console.log(initLog);
                this.logSvc.updateChatCompInitLog(initLog, initKey);
                this.updateMessagesSeenAndTotalMessages(this.loggedInUser.$key, this.messages.length);
              }
            });
          })
        });
      }
    })

  }

  ngAfterViewChecked() {
    if (this.oldMessagesSeenCount != this.newMessagesSeenCount) {
      this.oldMessagesSeenCount = this.newMessagesSeenCount;
      this.scrollToBottom();
    }

  }

  updateMessagesSeenAndTotalMessages(user, totalMessages) {
    if ((this.newMessagesSeenCount != totalMessages))
      this.chatSvc.updateMessagesSeenCount(user, totalMessages);
    if (this.totalMessages != totalMessages)
      //  Even with that check, this may be getting called several times by each client connected to the chat!!!
      this.chatSvc.updateTotalMessagesCount(totalMessages);
  }

  scrollToBottom() {
    this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
  }

  postMessage(chatForm) {
    if (chatForm.valid) {
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
