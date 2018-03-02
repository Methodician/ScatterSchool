import { Component, OnInit, AfterContentChecked, ElementRef, ViewChild, Input, AfterViewChecked } from '@angular/core';
import { ChatService } from 'app/shared/services/chat/chat.service'
import { UserService } from 'app/shared/services/user/user.service';
import { UserInfoOpen } from 'app/shared/class/user-info';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageList') private elementRef: ElementRef;
  @Input() loggedInUser: UserInfoOpen;
  @Input() totalMessages: number;
  newMessagesSeenCount: number;
  oldMessagesSeenCount = 0;
  messages;
  recipientKey = '';
  messagesSubscription;

  constructor(
    private chatSvc: ChatService,
    private userSvc: UserService
  ) { }

  ngOnInit() {
    this.chatSvc.currentChatKey$.subscribe(key => {
      if (key) {
        if (this.messagesSubscription) { this.messagesSubscription.unsubscribe() };
        this.messagesSubscription = this.chatSvc
          .getMessagesByKey(key)
          .valueChanges()
          .subscribe(messages => {
            this.messages = messages;
            // this.updateMessagesSeenAndTotalMessages(this.loggedInUser.$key, this.messages.length);
            this.chatSvc
              .getMessagesSeenCount(this.loggedInUser.$key)
              .valueChanges()
              .subscribe(messagesSeen => {
              this.newMessagesSeenCount = (messagesSeen as any).messagesSeenCount;
              // This gets called a million times...
              this.chatSvc.shouldUpdateSeenCount$.subscribe(iShould => {
                //  this gets called repeatedly...
                if (iShould) {
                  this.updateMessagesSeenAndTotalMessages(this.loggedInUser.$key, this.messages.length);
                }
              });
            })
        });
      }
    })

  }

  ngAfterViewChecked() {
    if (this.oldMessagesSeenCount !== this.newMessagesSeenCount) {
      this.oldMessagesSeenCount = this.newMessagesSeenCount;
      this.scrollToBottom();
    }

  }

  updateMessagesSeenAndTotalMessages(user, totalMessages) {
    if (this.newMessagesSeenCount !== totalMessages) {
      this.chatSvc.updateMessagesSeenCount(user, totalMessages);
    }
    //  Even with that check, this may be getting called several times by each client connected to the chat!!!
    if (this.totalMessages !== totalMessages) {
      this.chatSvc.updateTotalMessagesCount(totalMessages);
    }
  }

  scrollToBottom() {
    this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
  }

  postMessage(chatForm) {
    if (chatForm.valid) {
      const message = {
        sentBy: this.loggedInUser.$key,
        authorName: this.loggedInUser.displayName(),
        body: chatForm.text
      }
      this.chatSvc.saveMessage(message);
      chatForm.clearForm();
    }
  }

  isOwnMessage(authorKey) {
    return this.loggedInUser && authorKey === this.loggedInUser.$key;
  }
}
