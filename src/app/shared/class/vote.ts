export class Vote {
  constructor(
    public userKey: string,
    public suggestionKey: string,
    public voteStatus: number,
    public voteTotal: number
  ) {}

  get dbStatus () {
    return (this.voteStatus === 0) ? null : this.voteStatus;
  }
}
