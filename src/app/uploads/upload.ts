export class Upload {
  $key: string;
  file:File;
  url:string;
  createdAt: Date = new Date();
  constructor(file:File) {
    this.file = file;
  }
}
