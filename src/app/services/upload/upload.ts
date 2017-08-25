export class Upload {
  public $key: string;
  public file: File;
  public url: string;
  public fullPath: string;
  public name: string;
  public progress: number;
  public timeStamp: number;
  public uid: string;
  public size: number;
  public type: string;
  constructor(file:File) {
    this.file = file;
  }
}
 