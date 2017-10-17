import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {

  // LATER => currentChatKeys: string[];
  currentChatKey$: BehaviorSubject<string> = new BehaviorSubject(null);
  currentChatKey: string;

  constructor(
    private db: AngularFireDatabase
  ) { }

  updateTotalMessagesCount(totalMessages) {
    return this.db.object(`chatData/chats/${this.currentChatKey}`).update({totalMessagesCount: totalMessages})
  }

  updateMessagesSeenCount(userKey, totalMessages) {
    return this.db.object(`chatData/chats/${this.currentChatKey}/members/${userKey}`).update({messagesSeenCount: totalMessages});
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
    let dbChatsRef = this.getAllChats();
    let chatKey = dbChatsRef.push({ timestamp: firebase.database.ServerValue.TIMESTAMP }).key;

    this.currentChatKey = chatKey;
    this.currentChatKey$.next(chatKey);
    
    for (let user of users) {
      let displayName = user.alias ? user.alias : user.fName;
      this.db.object(`chatData/chats/${chatKey}/members/${user.$key}`).update({ name: displayName, messagesSeenCount: 0 });
      this.db.object(`chatData/chatsPerMember/${user.$key}/${chatKey}`).set(true);
      this.db.object(`chatData/membersPerChat/${chatKey}/${user.$key}`).update({ name: displayName });
    }
  }

  openChat(chatKey: string) {
    this.currentChatKey = chatKey;
    this.currentChatKey$.next(chatKey);
  }
}
