export class Vote {
  constructor(
    public userKey: string,
    public suggestionKey: string,
    public voteStatus: number
  ){}
}