export class ArticleDetailOpen {
    constructor(
        public author: string,
        public title: string,
        public bodyId: string,
        public lastUpdated: number,
        public timeStamp: number,
        public version: number,
        public tags?: string[]
    ) { }
}

export class ArticleDetailFirestore {
    constructor(
        public authorId: string,
        public bodyId: string,
        public commentCount: number,
        public introduction: string,
        public lastUpdated: Date,
        public timeStamp: Date,
        public title: string,
        public version: number,
        public isFeatured?: boolean,
        public tags?: string[]
    ) { }
}

export class ArticleEditorFirestore {
    constructor(
        public uid: string,
        public name: string,
        public timestamp: number
    ) { }
}