import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Vote } from 'app/shared/class/vote';

@Injectable()
export class VoteService {

  constructor(private db: AngularFireDatabase) { }

  getSuggestionVoteStateByUser(suggestionKey, userKey) {
    return this.db.object(`suggestionData/suggestionVotesPerUser/${userKey}/${suggestionKey}`);
  }

  getTotalVotesBySuggestion(suggestionKey) {
    return this.db.object(`suggestionData/suggestions/${suggestionKey}/voteCount`)
  }

  makeVote(vote: Vote) {
    //  Is this a good way? I like keeping duplicate hard-coded strings to a minimum.
    // this.getSuggestionVoteStateByUser(vote.suggestionKey, vote.userKey).set(vote.getDbVoteStatus());

    this.db
      .object(`suggestionData/suggestionVotesPerUser/${vote.userKey}/${vote.suggestionKey}`)
      .set(vote.getDbVoteStatus());
    this.db
      .object(`suggestionData/userVotesPerSuggestion/${vote.suggestionKey}/${vote.userKey}`)
      .set(vote.getDbVoteStatus());
    this.setTotalVotes(vote.suggestionKey, vote.voteTotal)
  }

  setTotalVotes(suggestionKey, voteTotal) {
    this
      .getTotalVotesBySuggestion(suggestionKey)
      .set(voteTotal);
  }
}
