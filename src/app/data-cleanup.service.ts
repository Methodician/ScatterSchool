import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase'

@Injectable()
export class DataCleanupService {
  fsDb = firebase.firestore();

  constructor(
    private fbd: AngularFireDatabase,
    private fsd: AngularFirestore
  ) { }

  getChatsFromFirebase() {
    return this.fbd.list('chatData/chats');
  }

  getChatsFromFirestore() {
    return this.fsd.collection<any>('chats');
  }

  getChatFromFirestoreById(id: string) {
    return this.fsd.doc(`chats/${id}`);
  }

  chatDataFromFirebaseToFirestore() {
    this.getChatsFromFirebase().subscribe(chats => {
      for (let chat of chats) {
        if (chat.members && chat.totalMessagesCount) {
          let newChat = {
            timestamp: chat.timestamp,
            totalMessagesCount: chat.totalMessagesCount
          }
          // this.getChatFromFirestoreById(chat.$key).set(newChat);
          // for (let memberKey in chat.members) {
          //   this.getChatFromFirestoreById(chat.$key)
          //     .collection('members').doc(memberKey).set(chat.members[memberKey]);
          // }
          this.getChatsFromFirestore().add(newChat).then(fsChat => {
            for (let memberKey in chat.members) {
              //console.log(member);
              this.getChatFromFirestoreById(fsChat.id)
                .collection('members').doc(memberKey).set(chat.members[memberKey]);
            }
          });
        }
      }
    })
  }

  articleNodeIdToKey() {
    return this.fbd.list('articleData/articles').subscribe(articles => {
      for (let article of articles) {
        console.log(article);
        if (article.bodyId) {
          article.bodyKey = article.bodyId;
          delete (article.bodyId);

        }
        if (article.authorId) {
          article.authorKey = article.authorId;
          delete (article.authorId);
        }

        console.log(article);
        this.fbd.object(`articleData/articles/${article.$key}`).set(article);
      }
    });
  }


}
