import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';


@Injectable()
export class SuggestionService {

  constructor(
    private db: AngularFireDatabase,
    private router: Router
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
    return this.injectListKeys(this.db.list('suggestionData/suggestions'));
  };

  getSuggestionByKey(key) {
    return this.injectObjectKey(this.db.object(`suggestionData/suggestions/${key}`));
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
}
