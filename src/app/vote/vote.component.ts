import { Router } from '@angular/router';
import { SuggestionService } from 'app/services/suggestion/suggestion.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { VoteService } from "app/services/vote/vote.service";
import { Vote } from "app/services/vote/vote";

@Component({
  selector: 'vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit, OnChanges {
  @Input() suggestion;
  @Input() currentUserKey;
  voteState = 0;
  voteTotal = 0;

  constructor(private voteSvc: VoteService, private router: Router) { }

  ngOnInit() {
    this.voteSvc.getSuggestionVoteStateByUser(this.suggestion.$key, this.currentUserKey).subscribe(voteStateData => {
      this.voteState = (voteStateData.$value) ? voteStateData.$value : 0;
    });
    // use if receiving suggestion key as input
    // this.voteSvc.getTotalVotesBySuggestion(this.suggestion.$key).subscribe(out => {
    //   this.voteTotal = out.$value;
    // })
  }

  // use if receiving suggestion object as input from parent subscription
  ngOnChanges(changes) {
    if(changes.suggestion) this.voteTotal = changes.suggestion.currentValue.voteCount; 
  }

  attemptVote(voteNum) {
    if (this.currentUserKey) this.vote(voteNum);
    else this.router.navigate(['login']);
  }

  // sets the current state of a user's vote
  // then calls a method to update the database
  // voteNum represents either a positive or negative vote
  vote(voteNum) {
      this.voteTotal += this.getTotalVoteChange(voteNum)
      // resets the component's vote state to 0 if the current vote state is equal to the vote that was just clicked
      this.voteState = (this.voteState === voteNum) ? 0 : voteNum;
      this.saveVote();
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
    let vote = new Vote(this.currentUserKey, this.suggestion.$key, this.voteState, this.voteTotal);
    this.voteSvc.makeVote(vote);
  }

  // returns boolean, true if given voteState equals current component voteState
  isActiveState(voteState) {
    return voteState === this.voteState;
  }
}
