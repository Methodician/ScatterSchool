import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  @Input() chatList;
  @Output() requestSender = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  requestChat(chatKey) {
    this.requestSender.emit(chatKey)
  }

  getMemberNames(chat) {
    return (<any>Object).values(chat.members).map(member => member.name).join(', ');
  }
}
