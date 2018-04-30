export class Notification {
    constructor(
        public followerId: string,
        public followerName: string,
        public notificationType: string,
        public timestamp: any,
        public userId: string,
        public timeViewed?: any
    ) { }

    readNotification() {
        return !!this.timeViewed;
    }
}