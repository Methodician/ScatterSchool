import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Injectable } from '@angular/core';

@Injectable()
export class ChatService {

  constructor(
    private fb: AngularFireDatabase,
    private fs: AngularFirestore
  ) { }

  getChatsFromFirestore() {
    return this.fs.collection<any>('chats');
  }

  getChatsWithMoreMessagesThan(messagesCount: number) {
    return this.fs.collection<any>('chats', ref =>
      ref.where('totalMessagesCount', '>', messagesCount)
    );
  }

  getChatFromFirestoreById(id: string) {
    return this.fs.doc(`chats/${id}`);
  }

  getMembersForChat(chatId) {
    return this.getChatFromFirestoreById(chatId).collection('members');
  }

  getMessagesForChat(chatId) {
    return this.getChatFromFirestoreById(chatId).collection('messages');
  }

  chatDataFromFirebaseToFirestore() {
    this.getChatsFromFirebase().subscribe(chats => {
      for (let chat of chats) {
        if (chat.members && chat.totalMessagesCount) {
          let newChat = {
            timestamp: chat.timestamp,
            totalMessagesCount: chat.totalMessagesCount
          }
          this.getChatFromFirestoreById(chat.$key).set(newChat);
          for (let memberKey in chat.members) {
            this.getChatFromFirestoreById(chat.$key)
              .collection('members').doc(memberKey).set(chat.members[memberKey]);
          }
          // this.getChatsFromFirestore().add(newChat).then(fsChat => {
          //   for (let memberKey in chat.members) {
          //     this.getChatFromFirestoreById(fsChat.id)
          //       .collection('members').doc(memberKey).set(chat.members[memberKey]);
          //   }
          // });
          this.getChatMessagesFromFirebase(chat.$key)
            .subscribe(messages => {
              for (let m of messages) {
                this.getChatFromFirestoreById(chat.$key)
                  .collection('messages').add(m);
              }
            });
        }
      }
    })
  }

  getChatsFromFirebase() {
    return this.fb.list('chatData/chats');
  }

  getChatMessagesFromFirebase(chatKey) {
    return this.fb.list(`chatData/messagesPerChat/${chatKey}`);
  }

}
