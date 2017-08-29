export class ArticleDetailOpen {
    constructor(
        public author: string,
        public introduction: string,
        public title: string,
        //public bodyId: string,
        public bodyKey: string,
        public authorKey: string,
        public lastUpdated: number,
        public timeStamp: number,
        public version: number,
        public tags?: string[]
    ) { }
}
