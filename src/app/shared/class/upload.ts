export class Upload {
  public $key: string;
  public file: File;
  public url: string;
  public fullPath: string;
  public name: string;
  public timestamp: any;
  public progress: number;
  public uid: string;
  public size: number;
  public type: string;
  constructor(file: File) {
    this.file = file;
  }
}
