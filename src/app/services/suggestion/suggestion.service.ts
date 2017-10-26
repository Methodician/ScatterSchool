import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase';
import { AngularFireObject, AngularFireList } from 'angularfire2/database';


@Injectable()
export class SuggestionService {

  constructor(
    private db: AngularFireDatabase,
    private router: Router
  ) { }

  getAllSuggestions() {
    return this.includeListMetadata(this.db.list('suggestionData/suggestions'));
  };

  getSuggestionByKey(key) {
    return this.includeObjectMetadata(this.db.object(`suggestionData/suggestions/${key}`));
  }

  saveSuggestion(suggestionData) {
    suggestionData.timestamp = firebase.database.ServerValue.TIMESTAMP;
    suggestionData.lastUpdated = firebase.database.ServerValue.TIMESTAMP;
    suggestionData.voteCount = 0;
    this.db.list('suggestionData/suggestions').push(suggestionData);
    this.router.navigate(['suggestions']);
  }

  updateSuggestion(key, paramsToUpdate) {
    paramsToUpdate.lastUpdated = firebase.database.ServerValue.TIMESTAMP;
    this.db.object(`suggestionData/suggestions/${key}`).update(paramsToUpdate);
    this.router.navigate(['suggestions']);
  }

  // import eventually
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
}
