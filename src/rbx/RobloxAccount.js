export default class RobloxAccount {
    username
    userId
    password
    cookie

    constructor(username, userId, password, cookie) {
        this.username = username;
        this.userId = userId;
        this.password = password;
        this.cookie = cookie;
    }
}
