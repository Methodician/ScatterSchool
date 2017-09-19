import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase';


@Injectable()
export class SuggestionService {

  constructor(
    private db: AngularFireDatabase,
    private router: Router
  ) { }

  getAllSuggestions() {
    return this.db.list('suggestionData/suggestions');
  };

  getSuggestionByKey(key) {
    return this.db.object(`suggestionData/suggestions/${key}`);
  }

  saveSuggestion(suggestionData) {

    suggestionData.timestamp = firebase.database.ServerValue.TIMESTAMP;
    suggestionData.lastUpdated = firebase.database.ServerValue.TIMESTAMP;
    suggestionData.voteCount = 0;

    this.getAllSuggestions().push(suggestionData);
    this.router.navigate(['suggestions']);
  }

  updateSuggestion(key, paramsToUpdate) {

    paramsToUpdate.lastUpdated = firebase.database.ServerValue.TIMESTAMP;

    this.getSuggestionByKey(key).update(paramsToUpdate);
    this.router.navigate(['suggestions']);
  }
}
