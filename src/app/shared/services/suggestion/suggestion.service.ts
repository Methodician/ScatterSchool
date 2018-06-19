import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Suggestion } from 'app/shared/class/suggestion.model';


@Injectable()
export class SuggestionService {

  constructor(
    private rtdb: AngularFireDatabase,
    private router: Router,
    private db: AngularFirestore
  ) { }

  getAllSuggestions(): AngularFirestoreCollection<Suggestion> {
    return this.db.collection(`suggestions`);
  };

  getSuggestionByKey(suggestionId: string): AngularFirestoreDocument<Suggestion> {
    return this.db.doc(`suggestions/${suggestionId}`);
  }

  saveSuggestion(suggestion) {
    suggestion.id = this.db.createId()
    suggestion.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    suggestion.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    suggestion.voteCount = 0;

    this.db
      .doc(`suggestions/${suggestion.id}`)
      .set(suggestion);
    this.router.navigate(['suggestions']);
  }

  updateSuggestion(suggestionId: string, paramsToUpdate) {
    paramsToUpdate.lastUpdated = firebase.database.ServerValue.TIMESTAMP;
    this.db
      .doc(`suggestions/${suggestionId}`)
      .update(paramsToUpdate);
    this.router.navigate(['suggestions']);
  }
}
