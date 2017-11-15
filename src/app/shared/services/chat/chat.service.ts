import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {// maybe should be renamed to UserInteractionService

  // LATER => currentChatKeys: string[];
  currentChatKey$: BehaviorSubject<string> = new BehaviorSubject(null);
  currentChatKey: string;

  //  research compound behavior subjects or subscriptions!!
  userInteractionTabSelected = null;
  userInteractionTabSelected$: BehaviorSubject<number> = new BehaviorSubject(null);
  userInteractionWindowExpanded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userInteractionWindowExpanded = false;
  shouldUpdateSeenCount$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  unreadMessages$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private db: AngularFireDatabase
  ) {
    this.userInteractionTabSelected$.subscribe(tabIndex => {
      if (tabIndex == 2 && this.userInteractionWindowExpanded)
        this.shouldUpdateSeenCount$.next(true);
      else this.shouldUpdateSeenCount$.next(false);
    });
    this.userInteractionWindowExpanded$.subscribe(isOpen => {
      if (isOpen && this.userInteractionTabSelected == 2)
        this.shouldUpdateSeenCount$.next(true);
      else this.shouldUpdateSeenCount$.next(false);
    })
  }

  selectUserInteractionTab(tabIndex: number) {
    this.userInteractionTabSelected = tabIndex;
    this.userInteractionTabSelected$.next(tabIndex);
  }

  toggleUserInteractionWindow(isOpen: boolean) {
    this.userInteractionWindowExpanded = isOpen;
    this.userInteractionWindowExpanded$.next(isOpen);
  }

  updateTotalMessagesCount(totalMessages) {
    return this.db.object(`chatData/chats/${this.currentChatKey}`).update({ totalMessagesCount: totalMessages })
  }

  updateMessagesSeenCount(userKey, totalMessages) {
    return this.db.object(`chatData/chats/${this.currentChatKey}/members/${userKey}`).update({ messagesSeenCount: totalMessages });
  }

  getMessagesSeenCount(userKey) {
    return this.db.object(`chatData/chats/${this.currentChatKey}/members/${userKey}`);
  }

  getAllMessages() {
    return this.db.list(`chatData/messages`);
  }

  getMessagesForCurrentChat() {
    return this.db.list(`chatData/messagesPerChat/${this.currentChatKey}`);
  }

  getMessagesByKey(chatKey) {
    return this.db.list(`chatData/messagesPerChat/${chatKey}`);
  }

  getAllChats() {
    return this.db.list('chatData/chats');
  }

  getChatByKey(chatKey) {
    return this.db.object(`chatData/chats/${chatKey}`);
  }

  getUserChatKeys(userKey) {
    return this.db.list(`chatData/chatsPerMember/${userKey}`)
  }

  getChatsByUserKey(userKey) {
    return this.db.list(`chatData/chatsPerMember/${userKey}`)
      .map(userChats => {
        return userChats.map(chat => this.db.object(`chatData/chats/${chat.$key}`));
      })
      .flatMap(firebaseObjectObservables => {
        return Observable.combineLatest(firebaseObjectObservables);
      });
  }

  saveMessage(messageData) {
    messageData.timestamp = firebase.database.ServerValue.TIMESTAMP;

    let dbMessageRef = this.getMessagesForCurrentChat().push(messageData);
  }

  createChat(users) {
    let dbChatsRef = this.db.list("chatData/chats");
    let chatKey = dbChatsRef.push({ timestamp: firebase.database.ServerValue.TIMESTAMP }).key;

    let updateObject = {};
    let memberObject = {};

    for (let user of users) {
      let displayName = user.alias ? user.alias : user.fName;
      updateObject[`members/${user.$key}/name`] = displayName;
      updateObject[`members/${user.$key}/messagesSeenCount`] = 0;
      memberObject[`${user.$key}/${chatKey}`] = true;
    }
  
    this.db.database.ref().child(`chatData/chats/${chatKey}`).update(updateObject)
    this.db.database.ref().child(`chatData/chatsPerMember`).update(memberObject)
  
    this.currentChatKey = chatKey;
    this.currentChatKey$.next(chatKey);

  }

  openChat(chatKey: string) {
    this.currentChatKey = chatKey;
    this.currentChatKey$.next(chatKey);
  }
}
