import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { Vote } from "app/services/vote/vote";

@Injectable()
export class VoteService {

  constructor(private db: AngularFireDatabase) {}

  getSuggestionVoteStateByUser(suggestionKey, userKey) {
    return this.db.object(`suggestionData/suggestionVotesPerUser/${userKey}/${suggestionKey}`);
  }

  getTotalVotesBySuggestion(suggestionKey) {
    return this.db.object(`suggestionData/suggestions/${suggestionKey}/voteCount`)
  }

  makeVote(vote: Vote){
    this.db.object(`suggestionData/suggestionVotesPerUser/${vote.userKey}/${vote.suggestionKey}`).set(vote.getDbVoteStatus());
    this.db.object(`suggestionData/userVotesPerSuggestion/${vote.suggestionKey}/${vote.userKey}`).set(vote.getDbVoteStatus());
    this.setTotalVotes(vote.suggestionKey, vote.voteTotal)
  }

  setTotalVotes(suggestionKey, voteTotal) {
    this.db.object(`suggestionData/suggestions/${suggestionKey}`).update({voteCount: voteTotal})   
  }
}
