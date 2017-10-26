import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
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

  // verify jordan meant to return the return of the update operation
  updateTotalMessagesCount(totalMessages) {
    return this.db.object(`chatData/chats/${this.currentChatKey}`).update({totalMessagesCount: totalMessages})
  }

  updateMessagesSeenCount(userKey, totalMessages) {
    return this.db.object(`chatData/chats/${this.currentChatKey}/members/${userKey}`).update({messagesSeenCount: totalMessages});
  }

  getMessagesSeenCount(userKey) {
    return this.includeObjectMetadata(this.db.object(`chatData/chats/${this.currentChatKey}/members/${userKey}`));
  }

  includeObjectMetadata(objectRef: AngularFireObject<{}>) {
    return objectRef.snapshotChanges().map(action => {
      const $key = action.payload.key;
      const data = {
        $key, ...action.payload.val()
      }
      return data;
    })
  }

  includeListMetadata(listRef: AngularFireList<{}>) {
    return listRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const $key = action.payload.key;
        const data = {
          $key, ...action.payload.val()
        };
        return data;
      })
    });
  }

  getAllMessages() {
    return this.includeListMetadata(this.db.list(`chatData/messages`))
    
  }

  getMessagesForCurrentChat() {
    return this.includeListMetadata(this.db.list(`chatData/messagesPerChat/${this.currentChatKey}`));
  }

  getMessagesByKey(chatKey) {
    return this.includeListMetadata(this.db.list(`chatData/messagesPerChat/${chatKey}`));
  }

  getAllChats() {
    return this.includeListMetadata(this.db.list('chatData/chats'));
  }

  getChatByKey(chatKey) {
    return this.includeObjectMetadata(this.db.object(`chatData/chats/${chatKey}`));
  }

  getUserChatKeys(userKey) {
    return this.includeListMetadata(this.db.list(`chatData/chatsPerMember/${userKey}`));
  }

  getChatsByUserKey(userKey) {
    const chatKeysObservable = this.includeListMetadata(this.db.list(`chatData/chatsPerMember/${userKey}`));
    const userChatObservables = chatKeysObservable.map(userChats => {
      return userChats.map(chat => {
        return this.includeObjectMetadata(this.db.object(`chatData/chats/${chat.$key}`))
      })
    });
    const userChatsObservable = userChatObservables.flatMap(userChatObservable => {
      return Observable.combineLatest(userChatObservable)
    });
    return userChatsObservable;
  }

  saveMessage(messageData) {
    messageData.timestamp = firebase.database.ServerValue.TIMESTAMP;
    this.db.list(`chatData/messagesPerChat/${this.currentChatKey}`).push(messageData)
  }

  createChat(users) {
    let chatsRef = this.db.list(`chatData/messages`); 
    let chatKey = chatsRef.push({ timestamp: firebase.database.ServerValue.TIMESTAMP }).key;

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
