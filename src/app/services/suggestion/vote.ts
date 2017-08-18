export class Vote {
  constructor(
    public userKey: string,
    public suggestionKey: string,
    public voteStatus: number
  ){}

  getDbVoteStatus() {
    return (this.voteStatus === 0) ? null : this.voteStatus;
  }
}