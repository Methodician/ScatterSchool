export class Upload {
  public $key: string;
  public file:File;
  public url:string;
  public lastUpdated: number,
  public timeStamp: number,
  constructor(file:File) {
    this.file = file;
  }
}
