import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'app/shared/services/user/user.service';
import { ChatService } from 'app/shared/services/chat/chat.service';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { Chat } from 'app/shared/class/chat';

@Component({
  selector: 'user-interaction',
  templateUrl: './user-interaction.component.html',
  styleUrls: ['./user-interaction.component.scss']
})
export class UserInteractionComponent implements OnInit {
  @ViewChild('uiTabs') uiTabs;
  selectedTab: string;
  loggedInUser: UserInfoOpen;
  chatList;
  userList;
  chatSubscription;
  currentChat: Chat;
  unreadMessages = false;
  windowExpanded = false;
  constructor(
    private userSvc: UserService,
    private chatSvc: ChatService
  ) { }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(user => {
      this.loggedInUser = user;
      if (user.exists()) {
        this.initializeChats(user.$key);
      }
    });
    this.openCurrentChat();
    this.chatSvc.userInteractionTabSelected$.subscribe(selectedTabIndex => {
      this.setCurrentTab(selectedTabIndex);
    })
  }

  initializeChats(userKey: string) {
    this.chatSvc
      .getUserChatKeys(userKey)
      .valueChanges()
      .subscribe(userChatKeys => {
        if (userChatKeys.length === 0) {
          this.userSvc
            .getUserList()
            .subscribe(userList => {
              this.userList = userList.filter(user => user.$key !== this.loggedInUser.$key);
            });
          this.chatSvc
            .getChatsByUserKey(userKey)
            .subscribe((chatList: any) => { // Note: this was throwing an error because it was self-typed as an "OperatorFunction<{}, {}>"
              this.chatList = chatList;
              this.checkUnreadMessages();
            });
        } else {
          this.chatSvc
            .getChatsByUserKey(userKey)
            .subscribe((chatList: any) => {
              this.chatList = chatList;
              this.checkUnreadMessages();
              this.getUserList();
            });
        }
      });
  }

  openCurrentChat() {
    this.chatSvc.currentChatKey$.subscribe(key => {
      if (key) {
        if (this.chatSubscription) { this.chatSubscription.unsubscribe() };
        this.chatSubscription = this.chatSvc
          .getChatByKey(key)
          .valueChanges()
          .subscribe(chat => {
            this.currentChat = chat as Chat;
          });
      }
    });
  }

  tabSelected($e) {
    this.chatSvc.selectUserInteractionTab($e.index);
  }

  checkUnreadMessages() {
    this.unreadMessages = !this.chatList.every(chat => {
      return chat.totalMessagesCount === chat.members[this.loggedInUser.$key].messagesSeenCount
    })
    this.chatSvc.unreadMessages$.next(this.unreadMessages);
  }

  handleRequest(request) {
    switch (request.type) {
      case 'openChat':
        this.createOrOpenChat(request.payload);
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

  openChat(chatKey) {
    console.log('chat opened: ', chatKey)
    this.chatSvc.openChat(chatKey);
    this.openTab('messages');
  }

  // this code will break if there is no currently logged in user
  // would prefer to leave as is, and not render the user list entirely until
  // the user has logged on
  createOrOpenChat(userArray) {
    const existingChat = this.findExistingChat(userArray);
    (existingChat) ? this.openChat(existingChat.$key) : this.createChat(userArray);
  }

  setCurrentTab(tabIndex: number) {
    //  Enums get reverse mapping. Cool! So UITabs[1] is 'chats' and UITabs['chats'] is 1
    this.selectedTab = UITabs[tabIndex];
  }

  openTab(tabName: string) {
    this.uiTabs.selectedIndex = UITabs[tabName];
    // switch (tabName) {
    //   case 'chats':
    //     this.chatTabs.selectedIndex = 1;
    //     return;
    //   case 'messages':
    //     this.chatTabs.selectedIndex = 2;
    //     return;
    //   case 'users':
    //   default:
    //     this.chatTabs.selectedIndex = 0;
    //     return;
    // }
  }

  toggleWindow() {
    this.windowExpanded = !this.windowExpanded;
    if (
      this.windowExpanded
      && this.unreadMessages
      && (this.selectedTab !== 'messages'
      )) {
      this.openTab('chats');
    }
    this.chatSvc.toggleUserInteractionWindow(this.windowExpanded);
  }

  // note: code is intentionally verbose, can be shortened if necessary
  findExistingChat(queriedUserList) {
    if (!this.chatList) { return false };

    return this.chatList.filter(chat => {
      const chatMembersLength = Object.keys(chat.members).length;
      // chat is identical if the queriedUserList is of the same length and contains every memberKey that chat.members contains
      return queriedUserList.length === chatMembersLength
        && queriedUserList.every(user => chat.members[user.$key])
    })[0];
    // ^ we can guarantee that there will never be identical chats the the database, so we always
    // return the first (and only) chat from the filtered array
  }

  addUserToChat(user) {
    const users = this.membersObjectToUsersArray(this.currentChat.members);
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

  getUserList() {
    this.userSvc
      .getUserList()
      .subscribe(userList => {
        this.userList = userList.filter(user => user.$key !== this.loggedInUser.$key);
      });
  }
}

export enum UITabs {
  'users' = 0,
  'chats' = 1,
  'messages' = 2
}
