export class Upload {
  public $key: string;
  public file: File;
  public url: string;
  public fullPath: string;
  public name: string;
  public progress: number;
  public lastUpdated: string;
  public timeStamp: string;
  public uid: string;
  public size: number;
  public type: string;
  constructor(file:File) {
    this.file = file;
  }
}
 