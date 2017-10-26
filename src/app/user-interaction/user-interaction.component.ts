import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'app/services/user/user.service';
import { ChatService } from 'app/services/chat/chat.service';
import { UserInfoOpen } from 'app/services/user/user-info';

@Component({
  selector: 'user-interaction',
  templateUrl: './user-interaction.component.html',
  styleUrls: ['./user-interaction.component.scss']
})
export class UserInteractionComponent implements OnInit {
  @ViewChild("chatTabs") chatTabs;
  loggedInUser: UserInfoOpen;
  chatList;
  userList;
  chatSubscription;
  currentChat;
  windowExpanded = false;
  constructor(
    private userSvc: UserService,
    private chatSvc: ChatService
  ){}

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(user => {
      this.loggedInUser = user;
      if(user) {        
        this.chatSvc.getUserChatKeys(user.$key).subscribe(userChatKeys => {
          if(userChatKeys.length == 0) {
            this.userSvc.getUserList().subscribe(userList => {
              this.userList = userList.filter(user => user.$key != this.loggedInUser.$key);
            });
            this.chatSvc.getChatsByUserKey(user.$key).subscribe(chatList => {
              this.chatList = chatList;
            });
          } else {
            this.chatSvc.getChatsByUserKey(user.$key).subscribe(chatList => {
              this.chatList = chatList;
              this.userSvc.getUserList().subscribe(userList => {
                this.userList = userList.filter(user => user.$key != this.loggedInUser.$key);
              });
            });
          }
        })
      }
    });
    this.chatSvc.currentChatKey$.subscribe(key => {
      if(key) {
        if(this.chatSubscription) this.chatSubscription.unsubscribe();
        this.chatSubscription = this.chatSvc.getChatByKey(key).subscribe(chat => {
          this.currentChat = chat;
        });
      }
    });
  }

  handleRequest(request) {
    switch(request.type) {
      case 'openChat':
        this.createOrOpenChat(request.payload)
        return
      case 'addUser':
        this.addUserToChat(request.payload);
        return;
      default:
        return;
    }
  }

  createChat(users) {
    this.chatSvc.createChat(users);
    this.openTab('messages');
  }

  openChat(chatKey){
    this.chatSvc.openChat(chatKey);
    this.openTab('messages');
  }

  // this code will break if there is no currently logged in user
  // would prefer to leave as is, and not render the user list entirely until
  // the user has logged on
  createOrOpenChat(userArray) {
    let existingChat = this.findExistingChat(userArray);
    (existingChat) ? this.openChat(existingChat.$key) : this.createChat(userArray);
  }

  openTab(tabName) {
    switch(tabName) {
      case 'chats':
        this.chatTabs.selectedIndex = 1;
        return; 
      case 'messages':
        this.chatTabs.selectedIndex = 2;
        return; 
      case 'users':
      default:
        this.chatTabs.selectedIndex = 0;
        return;
    }
  }

  toggleWindow() {
    this.windowExpanded = !this.windowExpanded;
  }

  //note: code is intentionally verbose, can be shortened if necessary
  findExistingChat(queriedUserList) {
    if(!this.chatList) return false;
    console.log('chatList: ', this.chatList)
    return this.chatList.filter(chat => {
      let chatMembersLength = Object.keys(chat.members).length;
      // chat is identical if the queriedUserList is of the same length and contains every memberKey that chat.members contains
      return queriedUserList.length === chatMembersLength
          && queriedUserList.every(user => chat.members[user.$key])
    })[0];
    // ^ we can guarantee that there will never be identical chats the the database, so we always
    // return the first (and only) chat from the filtered array
  }

  addUserToChat(user) {
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
}
