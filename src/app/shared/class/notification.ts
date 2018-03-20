export class Notification {
    constructor (
        public followerId: string,
        public followerName: string,
        public notificationType: string,
        public timestamp: Date,
        public userId: string,
        public timeViewed?: Date
    ) {}

    readNotification() {
        return !!this.timeViewed;
    }
}