export class UserInfoOpen {
    constructor(
        public alias: string,
        public fName: string,
        public lName: string,
        public zipCode: string,
        public $key?: string,
        public uid?: string,
        public bio?: string,
        public city?: string,
        public state?: string,
    ) { }

    displayName() {
        return this.alias ? this.alias : this.fName;
    }

    // returns true if $key or uid contains a truthy value (is neither null nor an empty string)
    exists() {
        return !!(this.$key || this.uid)
    }
}