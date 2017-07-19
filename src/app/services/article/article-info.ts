export class ArticleDetailOpen {
    constructor(
        public author: string,
        public title: string,
        public bodyId: string,
        public lastUpdated: number,
        public timeStamp: number,
        public version: number,
        public tags?: {}
    ) { }
}
