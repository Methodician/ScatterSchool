import { Component, OnInit, AfterContentChecked, ElementRef, ViewChild, Input } from '@angular/core';
import { ChatService } from 'app/shared/services/chat/chat.service'
import { UserService } from 'app/shared/services/user/user.service';
import { UserInfoOpen } from 'app/shared/class/user-info';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messageList') private elementRef: ElementRef;
  @Input() loggedInUser: UserInfoOpen;
  // @Input() selectedTabIndex: number;
  // selectedTabIndex: number;
  @Input() totalMessages: number;
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
<<<<<<< HEAD:src/app/chat/chat.component.ts

=======
>>>>>>> master:src/app/components/user-interaction/chat/chat.component.ts
    this.chatSvc.currentChatKey$.subscribe(key => {
      if (key) {
        if (this.messagesSubscription) this.messagesSubscription.unsubscribe();
        this.messagesSubscription = this.chatSvc.getMessagesByKey(key).subscribe(messages => {
          this.messages = messages;
<<<<<<< HEAD:src/app/chat/chat.component.ts
          //this.updateMessagesSeenAndTotalMessages(this.loggedInUser.$key, this.messages.length);
          this.chatSvc.getMessagesSeenCount(this.loggedInUser.$key).subscribe(messagesSeen => {
            this.newMessagesSeenCount = messagesSeen.messagesSeenCount;
            // This gets called a million times...
            this.chatSvc.shouldUpdateSeenCount$.subscribe(iShould => {
              //  this gets called repeatedly...
              if (iShould)
                this.updateMessagesSeenAndTotalMessages(this.loggedInUser.$key, this.messages.length);
            });

=======
          this.updateMessagesSeenAndTotalMessages(this.loggedInUser.$key, this.messages.length);
          this.chatSvc.getMessagesSeenCount(this.loggedInUser.$key).subscribe(messagesSeen => {
            this.newMessagesSeenCount = messagesSeen.messagesSeenCount;
>>>>>>> master:src/app/components/user-interaction/chat/chat.component.ts
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
