export class Chat {
    constructor(
        public members: object[],
        public timestamp: number,
        public totalMessagesCount: number
    ) { }
}