import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class ChatService {

  constructor(
    private db: AngularFireDatabase
  ) {}

  getAllMessages() {
    return this.db.list(`chatData/messages`);
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
    let messageToSave = {
      text: messageData.text,
      authorKey: messageData.authorKey,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }

    let dbMessageRef = this.getAllMessages().push(messageToSave);
    this.saveMessageRecipientAuthorAssociation(dbMessageRef.key, messageData.recipientKey, messageData.authorKey)
  }

  saveMessageRecipientAuthorAssociation(messageKey, recipientKey, authorKey) {
    this.db.object(`chatData/messagesPerRecipientPerAuthor/${authorKey}/${recipientKey}/${messageKey}`).set(true);
  }

}
