import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';


@Injectable()
export class SuggestionService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getAllSuggestions() {
    return this.db.list('suggestionData/suggestions').map
  };


}
