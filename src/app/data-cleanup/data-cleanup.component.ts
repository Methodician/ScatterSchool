import { DataCleanupService } from './../data-cleanup.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-cleanup',
  templateUrl: './data-cleanup.component.html',
  styleUrls: ['./data-cleanup.component.scss']
})
export class DataCleanupComponent implements OnInit {
  chats: any;

  constructor(private dataSvc: DataCleanupService) { }

  ngOnInit() {
  }

  articleNodeIdToKey() {
    this.dataSvc.articleNodeIdToKey();
  }

  getChatsFromFirebase() {
    this.chats = this.dataSvc.getChatsFromFirebase();
  }

  getChatsFromFirestore() {
    //this.chats = this.dataSvc.getChatsFromFirestore().valueChanges();
    this.chats = this.dataSvc.getChatsFromFirestore().snapshotChanges()
      .map(chats => {
        return chats.map(chat => {
          const data = chat.payload.doc.data();
          const id = chat.payload.doc.id;
          return { id, ...data };
        })
      }).subscribe(chats => {
        this.chats = chats;
      });
    //  Just testing the querying:
    //this.chats = this.dataSvc.getChatsWithMoreMessagesThan(3).valueChanges();
  }

  addMembersToChats() {
    for (let chat of this.chats) {
      this.dataSvc.getMembersForChat(chat.id).snapshotChanges()
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

  // getChatsFromFirestore() {
  //   this.chats = this.dataSvc.getChatsFromFirestore().snapshotChanges()
  //     .map(chats => {
  //       return chats.map(chat => {
  //         this.dataSvc.getMembersForChat(chat.id).valueChanges()
  //           .subscribe(members => {
  //             chat.members = members;
  //             return chat;
  //           });
  //       });
  //     });
  // }

  moveChatsToFirestore() {
    this.dataSvc.chatDataFromFirebaseToFirestore();
  }

}
