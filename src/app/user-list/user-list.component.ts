import { ChatService } from './../services/chat/chat.service';
import { UserInfoOpen } from './../services/user/user-info';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user/user.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  userList;
  chatList;
  currentChat;
  loggedInUser: UserInfoOpen;

  constructor(
    private userSvc: UserService,
    private chatSvc: ChatService
  ) {}

  ngOnInit() {
    this.userSvc.getUserList().subscribe(userList => {
      this.userList = userList;
    });
    this.userSvc.userInfo$.subscribe(user => {
      this.loggedInUser = user;
      if(user) { 
        this.chatSvc.getChatsByUserKey(user.$key).subscribe(chatList => {
          this.chatList = chatList;     
        });
      }
    });

    this.chatSvc.currentChatKey$.subscribe(key => {
      if(key) {
        this.chatSvc.getChatByKey(key).subscribe(chat => {
          this.currentChat = chat;
        });
      }
    });
  }

  createChat(users) {
    this.chatSvc.createChat(users);
  }

  openChat(chatKey){
    this.chatSvc.openChat(chatKey);
  }

  // this code will break if there is no currently logged in user
  // would prefer to leave as is, and not render the user list entirely until
  // the user has logged on
  createOrOpenChat(users) {
    let existingChat = this.findExistingChat(users);
    (existingChat) ? this.openChat(existingChat.$key) : this.createChat(users);
  }

  //note: code is intentionally verbose, can be shortened if necessary
  findExistingChat(queriedUserList) {
    if(!this.chatList) return false;

    return this.chatList.filter(chat => {
      let chatMembersLength = Object.keys(chat.members).length;
      // chat is identical if the queriedUserList is of the same length and contains every memberKey that chat.members contains
      return queriedUserList.length === chatMembersLength  && queriedUserList.every(user => chat.members[user.$key])
    })[0];
    // ^ we can guarantee that there will never be identical chats the the database, so we always
    // return the first (and only) chat from the filtered array
  }

  addUserToChat(user, event) {
    event.stopPropagation();
    let users = this.membersObjectToUsersArray(this.currentChat.members);
    users.push(user);
    this.createOrOpenChat(users)
  }

  // The current POC compromise. We are accessing data on current chat users
  // from the currentChat object members node. The naming conventions are different
  // from the UserInfoOpen class we recieve from the userList, but provide enough
  // data to create the necessary associations in the database (and use the same service method).
  membersObjectToUsersArray(members) {
    return Object.keys(this.currentChat.members).map(memberKey => {
      return {
        alias: this.currentChat.members[memberKey].name,
        $key: memberKey
      }
    });
  }
  
  isNotInCurrentChat(userKey) {
    return !this.currentChat.members[userKey];
  }  

  getMemberNames(chat) {
    return (<any>Object).values(chat.members).map(member => member.name).join(', ');
  }

  displayName(user) {
    return user.alias ? user.alias : user.fName;
  }

  calculateUnreadMessages(chat) {
    const totalMessages = chat.totalMessagesCount;
    const messagesSeen = chat.members[this.loggedInUser.$key].messagesSeenCount;
    return (totalMessages === messagesSeen) ? true : false;
  }
}
