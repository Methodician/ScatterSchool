import { SuggestionService } from 'app/services/suggestion/suggestion.service';
import { Component, OnInit, Input } from '@angular/core';
import { Vote } from "app/services/suggestion/vote";

@Component({
  selector: 'vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {
  @Input() suggestion;

  voteState = 0;
  totalVotes = 0;
  // currently static, eventually needs to access currently logged in user.
  currentUserKey = "wmmtEduyNiftlVazG03JCUYIWo82"; 
  constructor(private service: SuggestionService) { }

  ngOnInit() {
    // getting all user votes of the current suggestion, and calling methods to process that data
    this.service.getSuggestionVotes(this.suggestion.$key).subscribe(suggestionVotes => {
      this.updateVoteState(suggestionVotes);
      this.updateTotalVotes(suggestionVotes);
    });
  }

  // sums the positive and negative votes of a given suggestion
  updateTotalVotes(suggestionVotes) {
    this.totalVotes = suggestionVotes.reduce((sum, current) => {
      return sum + current.$value;
    }, 0);
  }

  // updates the current state of a user's vote with suggestion information from subscription
  updateVoteState(suggestionVotes) {
    this.voteState = this.getCurrentUserVote(suggestionVotes);
  }

  // searches all votes of a suggestion and returns the current user's vote
  // if the user has not voted, returns 0
  getCurrentUserVote(suggestionVotes) {
    let currentUserVote = suggestionVotes.find(suggestion => {
      return suggestion.$key === this.currentUserKey;
    });
    return currentUserVote ? currentUserVote.$value : 0;
  }

  // sets the current state of a user's vote
  // then calls a method to update the database
  // voteNum represents either a positive or negative vote
  // if the current vote state is equal to the vote that was just clicked
  // reset the component's vote state to 0
  vote(voteNum) {
    this.voteState = (this.voteState === voteNum) ? 0 : voteNum;
    this.saveVote();
  }

  // upvote() and downvote() together achieve what vote() does
  upvote() {
    this.voteState = (this.voteState === 1) ? 0 : 1;
    this.saveVote();
  }

  downvote() {
    this.voteState = (this.voteState === -1) ? 0 : -1;
    this.saveVote();
  }

  // sends current vote information to service to be saved to the database
  // creates new vote object containing current user, suggestion, and vote state data
  saveVote() {
    let vote = new Vote(this.currentUserKey, this.suggestion.$key, this.voteState);
    this.service.makeVote(vote);
  }

  // returns boolean, true if given voteState equals current component voteState
  isActiveState(voteState) {
    return voteState === this.voteState;
  }
}
