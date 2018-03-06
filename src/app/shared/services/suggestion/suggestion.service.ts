import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()
export class SuggestionService {

  constructor(
    private rtdb: AngularFireDatabase,
    private router: Router,
    private db: AngularFirestore
  ) { }

  injectListKeys(list: AngularFireList<{}>) {
    return list
      .snapshotChanges()
      .map(elements => {
        return elements.map(element => {
          return {
            $key: element.key,
            ...element.payload.val()
          };
        });
      });
  }

  injectObjectKey(object: AngularFireObject<{}>) {
    return object
      .snapshotChanges()
      .map(element => {
        return {
          $key: element.key,
          ...element.payload.val()
        };
      });
  }

  getAllSuggestions() {
    return this.injectListKeys(this.rtdb.list('suggestionData/suggestions'));
  };

  getSuggestionByKey(key) {
    return this.injectObjectKey(this.rtdb.object(`suggestionData/suggestions/${key}`));
  }

  saveSuggestion(suggestion) {
    suggestion.id = this.db.createId()
    suggestion.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    suggestion.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    suggestion.voteCount = 0;

    this.db.doc(`suggestions/${suggestion.id}`).set(suggestion);
    this.router.navigate(['suggestions']);
  }

  updateSuggestion(key, paramsToUpdate) {
    paramsToUpdate.lastUpdated = firebase.database.ServerValue.TIMESTAMP;

    this.rtdb.object(`suggestionData/suggestions/${key}`).update(paramsToUpdate);
    this.router.navigate(['suggestions']);
  }
}
