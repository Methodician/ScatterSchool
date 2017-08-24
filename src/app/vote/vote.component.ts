import { Router } from '@angular/router';
import { SuggestionService } from 'app/services/suggestion/suggestion.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Vote } from "app/services/suggestion/vote";

@Component({
  selector: 'vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit, OnChanges {
  @Input() suggestion;
  @Input() currentUserKey;
  voteState = 0;
  totalVotes = 0;

  constructor(private service: SuggestionService, private router: Router) { }

  ngOnInit() {
    // can we add subscriptions in the service? I would like to avoid subscribing to every individual vote state.
    if(this.currentUserKey) {
      this.service.getSuggestionVoteStateByUser(this.suggestion.$key, this.currentUserKey).subscribe(voteStateData => {
        this.voteState = (voteStateData.$value) ? voteStateData.$value : 0;
      });
    }
  }

  ngOnChanges(changes) {
    this.totalVotes = changes.suggestion.currentValue.voteCount;
  }

  // sets the current state of a user's vote
  // then calls a method to update the database
  // voteNum represents either a positive or negative vote
  vote(voteNum) {
    if(this.currentUserKey){
      this.totalVotes += this.getTotalVoteChange(voteNum)
      // resets the component's vote state to 0 if the current vote state is equal to the vote that was just clicked
      this.voteState = (this.voteState === voteNum) ? 0 : voteNum;
      this.saveVote();
    } else {
      this.router.navigate(['login'])
    }
  }

  getTotalVoteChange(voteNum){
    switch(Math.abs(voteNum + this.voteState)) {
      case 0: return voteNum * 2;
      case 1: return voteNum;
      case 2: return this.voteState * -1;
    }
  }

  // creates new vote object containing current user, suggestion, and vote state data
  saveVote() {
    let vote = new Vote(this.currentUserKey, this.suggestion.$key, this.voteState, this.totalVotes);
    this.service.makeVote(vote);
  }

  // returns boolean, true if given voteState equals current component voteState
  isActiveState(voteState) {
    return voteState === this.voteState;
  }
}
