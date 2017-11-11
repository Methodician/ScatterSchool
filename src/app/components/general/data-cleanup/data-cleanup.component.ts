import { ChatService } from 'app/shared/services/firestore/chat.service';
import { Observable } from 'rxjs/Observable';
import { DataCleanupService } from 'app/shared/services/firestore/data-cleanup.service';
//import { DataCleanupService } from 'app/shared/services/data-cleanup.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-cleanup',
  templateUrl: './data-cleanup.component.html',
  styleUrls: ['./data-cleanup.component.scss']
})
export class DataCleanupComponent implements OnInit {
  chats: any;
  selectedChat: any;

  constructor(
    private dataSvc: DataCleanupService,
    private chatSvc: ChatService
  ) { }

  ngOnInit() {
  }

  articleNodeIdToKey() {
    this.dataSvc.articleNodeIdToKey();
  }

  getChatsFromFirebase() {
    this.chats = this.chatSvc.getChatsFromFirebase();
  }

  getChatsWithMembersFromFirestore() {
    this.chats = this.chatSvc.getChatsFromFirestore().snapshotChanges()
      .map(chatSnaps => {
        return chatSnaps.map(chat => {
          const chatData = chat.payload.doc.data();
          const chatId = chat.payload.doc.id;
          return this.chatSvc.getMembersForChat(chatId)
            .snapshotChanges()
            .map(memberSnaps => {
              return memberSnaps.map(member => {
                const data = member.payload.doc.data();
                const id = member.payload.doc.id;
                return { id, ...data }
                // return { [id]: data }
              });
            })
            .map(members => {
              return { chatId, ...chatData, members: members };
              // return {
              //   [chatId]: {
              //     members: members,
              //     ...chatData
              //   }
              // };
            });
        })
      })
      .flatMap(chats => Observable.combineLatest(chats));
  }

  getChatsFromFirestore() {
    this.chats = this.chatSvc.getChatsFromFirestore().snapshotChanges()
      .map(chats => {
        return chats.map(chat => {
          const data = chat.payload.doc.data();
          const id = chat.payload.doc.id;
          return { id, ...data };
          //return { [id]: data };
        });
      });
  }

  getChatDetail(chat) {
    //console.log(chat);
    this.chatSvc.getMembersForChat(chat.id).snapshotChanges()
      .map(memberSnaps => {
        return memberSnaps.map(member => {
          const data = member.payload.doc.data();
          const id = member.payload.doc.id;
          return { id, ...data };
        })
      }).subscribe(members => {
        chat.members = members;
      });

    this.chatSvc.getMessagesForChat(chat.id).valueChanges()
      .subscribe(messages => {
        chat.messages = messages;
      });
  }

  selectChat(clickedChat) {
    let chat = { ...clickedChat }
    this.getChatDetail(chat);
    this.selectedChat = chat;
  }

  addMembersToChats() {
    for (let chat of this.chats) {
      this.chatSvc.getMembersForChat(chat.id).snapshotChanges()
        .map(membersSnaps => {
          return membersSnaps.map(member => {
            const data = member.payload.doc.data();
            const id = member.payload.doc.id;
            return { id, ...data }
          })
        })
        .subscribe(members => {
          chat.members = members;
        });
    }

  }

  moveChatsToFirestore() {
    this.chatSvc.chatDataFromFirebaseToFirestore();
    //this.dataCleanupSvc.articleNodeIdToKey();
  }

}
