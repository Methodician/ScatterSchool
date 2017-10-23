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
    this.chats = this.dataSvc.getChatsFromFirestore().valueChanges();
  }

  moveChatsToFirestore() {
    this.dataSvc.chatDataFromFirebaseToFirestore();
  }

}
