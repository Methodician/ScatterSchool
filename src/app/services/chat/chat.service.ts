import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class ChatService {

  // LATER => currentChatKeys: string[];
  currentChatKey$: BehaviorSubject<string> = new BehaviorSubject(null);
  currentChatKey: string;

  constructor(
    private db: AngularFireDatabase
  ) { }

  getAllMessages() {
    return this.db.list(`chatData/messages`);
  }

  getMessagesForCurrentChat() {
    return this.db.list(`chatData/messagesPerChat/${this.currentChatKey}`);
  }

  getAllChats() {
    return this.db.list('chatData/chats');
  }

  // getMessagesByRecipientAndAuthor(recipientKey, authorKey) {
  //   this.db.list(`chatData/messagesPerRecipientPerAuthor/${authorKey}/${recipientKey}`)
  //     .map(messagesPerKey => messagesPerKey
  //       .map(message =>
  //         this.db.object(`chatData/messages/${message.$key}`)
  //       ))
  //     .flatMap(firebaseObjects =>
  //       Observable.combineLatest(firebaseObjects));
  // }

  saveMessage(messageData) {
    /* let messageToSave = {
      text: messageData.text,
      authorKey: messageData.authorKey,
      authorName: messageData.authorName,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    } */
    messageData.timestamp = firebase.database.ServerValue.TIMESTAMP;

    let dbMessageRef = this.getMessagesForCurrentChat().push(messageData);

    //let dbMessageRef = this.getAllMessages().push(messageToSave);
    //this.saveMessageRecipientAuthorAssociation(dbMessageRef.key, messageData.recipientKey, messageData.authorKey)
  }

  // getAllMembersPerChat() {
  //   return this.db.list()
  // }

  createChat(users) {
    let dbChatsRef = this.getAllChats();
    let chatKey = dbChatsRef.push({ timestamp: firebase.database.ServerValue.TIMESTAMP }).key;
    this.currentChatKey = chatKey;
    this.currentChatKey$.next(chatKey);
    for (let user of users) {
      let displayName = user.alias ? user.alias : user.fName;
      this.db.object(`chatData/chats/${chatKey}/members/${user.$key}`).update({ name: displayName });
      this.db.object(`chatData/chatsPerMember/${user.$key}/${chatKey}`).set(true);
      this.db.object(`chatData/membersPerChat/${chatKey}/${user.$key}`).update({ name: displayName });
    }
  }

  openChat(chatKey: string) {
    this.currentChatKey = chatKey;
    this.currentChatKey$.next(chatKey);
  }

  // saveMessageRecipientAuthorAssociation(messageKey, recipientKey, authorKey) {
  //   this.db.object(`chatData/messagesPerRecipientPerAuthor/${authorKey}/${recipientKey}/${messageKey}`).set(true);
  // }

}
