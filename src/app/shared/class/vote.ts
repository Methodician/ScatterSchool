export class Vote {
  constructor(
    public userKey: string,
    public suggestionKey: string,
    public voteStatus: number,
    public voteTotal: number
  ) {}

  getDbVoteStatus() {
    return (this.voteStatus === 0) ? null : this.voteStatus;
  }
}
