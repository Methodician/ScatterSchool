import { ChatService } from 'app/shared/services/chat/chat.service';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserService } from 'app/shared/services/user/user.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() userList;
  @Input() loggedInUser: UserInfoOpen;
  @Input() currentChat;
  @Output() requestSender = new EventEmitter();

  constructor(private userSvc: UserService) { }

  ngOnInit() { }

  requestChat(userArray) {
    this.requestSender.emit({ type: 'openChat', payload: userArray });
  }

  requestAddUser(user, event) {
    event.stopPropagation();
    this.requestSender.emit({ type: 'addUser', payload: user });
  }

  isNotInCurrentChat(userKey) {
    return !this.currentChat.members[userKey];
  }

  displayName(user) {
    return user.alias ? user.alias : user.fName;
  }



  getProfileImageUrl(userKey: string) {
    return this.userSvc.getProfileImageUrl(userKey);
  }
}
