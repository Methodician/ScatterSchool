import { Injectable } from '@angular/core';
// import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";
import { Vote } from "app/services/vote/vote";
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';

@Injectable()
export class VoteService {

  constructor(private db: AngularFireDatabase) { }

  getSuggestionVoteStateByUser(suggestionKey, userKey) {
    return this.includeObjectMetadata(this.db.object(`suggestionData/suggestionVotesPerUser/${userKey}/${suggestionKey}`));
  }

  getTotalVotesBySuggestion(suggestionKey) {
    return this.includeObjectMetadata(this.db.object(`suggestionData/suggestions/${suggestionKey}/voteCount`));
  }

  makeVote(vote: Vote) {
    // Is this a good way? I like keeping duplicate hard-coded strings to a minimum.
    //this.getSuggestionVoteStateByUser(vote.suggestionKey, vote.userKey).set(vote.getDbVoteStatus());

    this.db.object(`suggestionData/suggestionVotesPerUser/${vote.userKey}/${vote.suggestionKey}`).set(vote.getDbVoteStatus());
    this.db.object(`suggestionData/userVotesPerSuggestion/${vote.suggestionKey}/${vote.userKey}`).set(vote.getDbVoteStatus());
    this.setTotalVotes(vote.suggestionKey, vote.voteTotal)
  }

  setTotalVotes(suggestionKey, voteTotal) {
    this.db.object(`suggestionData/suggestions/${suggestionKey}/voteCount`).set(voteTotal);
    //this.db.object(`suggestionData/suggestions/${suggestionKey}`).update({ voteCount: voteTotal })
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
}
