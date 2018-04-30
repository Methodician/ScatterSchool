import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Vote } from 'app/shared/class/vote';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class VoteService {

  constructor(
    private rtdb: AngularFireDatabase,
    private db: AngularFirestore
  ) { }

  getVoteState(suggestionKey, userKey) {
    return this.rtdb.object(`voteData/suggestionVotesPerUser/${userKey}/${suggestionKey}`);
  }

  saveVote(vote: Vote) {
    this.db
      .doc(`suggestions/${vote.suggestionKey}`)
      .update({ voteCount: vote.voteTotal });
    this.rtdb
      .object(`voteData/suggestionVotesPerUser/${vote.userKey}/${vote.suggestionKey}`)
      .set(vote.dbStatus);
    this.rtdb
      .object(`voteData/userVotesPerSuggestion/${vote.suggestionKey}/${vote.userKey}`)
      .set(vote.dbStatus);
  }
}
