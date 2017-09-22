import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat/chat.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // @Input() authorKey;
  // @Input() recipientKey;
  messages;
  authorKey: string = "";
  recipientKey: string = "";

  constructor(private chatSvc: ChatService) { }

  ngOnInit() {
    this.chatSvc.getAllMessages().subscribe(messages => {
      this.messages = messages;
    });
    // this.chatSvc.getMessagesByRecipientAndAuthor(this.recipientKey, this.authorKey).subscribe(messages => {
    //   this.messages = messages;
    // });
  }

  sendMessage(message) {
    let messageData = {
      authorKey: this.authorKey,
      recipientKey: this.recipientKey,
      text: message,
    }
    this.chatSvc.saveMessage(messageData);
  }
}
