import { Router } from '@angular/router';
import { SuggestionService } from 'app/shared/services/suggestion/suggestion.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { VoteService } from 'app/shared/services/vote/vote.service';
import { Vote } from 'app/shared/class/vote';

@Component({
  selector: 'vote',
  templateUrl: './suggestion-vote.component.html',
  styleUrls: ['./suggestion-vote.component.scss']
})
export class SuggestionVoteComponent implements OnInit, OnChanges {
  @Input() suggestion;
  @Input() currentUserKey;
  voteState = 0;
  voteTotal = 0;

  constructor(private voteSvc: VoteService, private router: Router) { }

  ngOnInit() {
    if (this.currentUserKey) {
      this.voteSvc
        .getSuggestionVoteStateByUser(this.suggestion.$key, this.currentUserKey)
        .valueChanges()
        .subscribe(voteState => {
          this.voteState = (voteState) ? voteState as number : 0;
        });
    }
  }

  ngOnChanges(changes) {
    if (changes.suggestion) { this.voteTotal = changes.suggestion.currentValue.voteCount };
  }

  attemptVote(voteNum) {
    if (this.currentUserKey) {
      this.vote(voteNum)
    } else { this.router.navigate(['login']) };
  }

  // sets the current state of a user's vote
  vote(voteNum: number) {
    this.voteTotal += this.getTotalVoteChange(voteNum)
    // resets the component's vote state to 0 if the current vote state is equal to the vote that was just clicked
    this.voteState = (this.voteState === voteNum) ? 0 : voteNum;
    this.saveVote();
  }

  getTotalVoteChange(voteNum) {
    switch (Math.abs(voteNum + this.voteState)) {
      case 0: return voteNum * 2;
      case 1: return voteNum;
      case 2: return this.voteState * -1;
    }
  }

  // creates new vote object containing current user, suggestion, and vote state data
  saveVote() {
    const vote = new Vote(this.currentUserKey, this.suggestion.$key, this.voteState, this.voteTotal);
    this.voteSvc.makeVote(vote);
  }

  // returns boolean, true if given voteState equals current component voteState
  isActiveState(voteState) {
    return voteState === this.voteState;
  }
}
