import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Injectable()
export class SuggestionService {
  suggestions: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase      
  ) { this.suggestions = db.list('suggestions');
  }

  getAllSuggestions() {
    return this.db.list('suggestionData/suggestions');
  };
}
