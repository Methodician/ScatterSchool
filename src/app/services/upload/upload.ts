export class Upload {
  public $key: string;
  public file: File;
  public url: string;
  public fullPath: string
  public name: string;
  public progress: number;
  public lastUpdated: string;
  public timeStamp: string;
  constructor(file:File) {
    this.file = file;
  }
}
