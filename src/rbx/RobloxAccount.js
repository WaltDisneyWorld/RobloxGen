export default class RobloxAccount {
  username;
  userId;
  password;
  cookie;

  /**
   * @param  {string} username
   * @param  {number} userId
   * @param  {string} password
   * @param  {string} cookie
   */

  constructor(username, userId, password, cookie) {
    this.username = username;
    this.userId = userId;
    this.password = password;
    this.cookie = cookie;
  }
}
