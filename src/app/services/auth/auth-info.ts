
export class AuthInfo {

    constructor(
        public $uid: string,
        public emailVerified = false
    ) { }

    isLoggedIn() {
        console.log('uid:', this.$uid);
        return !!this.$uid;
    }

    isEmailVerified() {
        console.log('emailVerified:', this.emailVerified);
        return !!this.emailVerified;
    }
}