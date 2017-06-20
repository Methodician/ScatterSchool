export class UserInfoOpen {
    constructor(
        public alias: string,
        public fName: string,
        public lName: string,
        public zipCode: string,
        public $key?: string,
        public bio?: string,
        public city?: string,
        public state?: string,
    ) { }
}
