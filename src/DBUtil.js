import mysql from 'mysql2/promise';
import RobloxAccount from './rbx/RobloxAccount.js';

class DBUtil {

    host
    user
    pass
    database

    /**
     * @type {mysql.Connection}
     */
    connection

    constructor() {
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_DB
            });
            console.log('[✅] Connected to the database')
            return true;
        } catch (ex) {
            console.log(`[❌] Failed to connect to the database (${ex})`);
            return false;
        }
    }

    async setupDB() {
        try {
            await this.connection.execute(`
            CREATE TABLE \`accounts\` (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                user_id BIGINT NOT NULL,
                username VARCHAR(30) NOT NULL,
                password VARCHAR(30) NOT NULL,
                cookie VARCHAR(900) NOT NULL
            );`);
            console.log('[✅] Created accounts table');
        } catch (ex) {}
    }

    async addAccount(userId, username, password, cookie) {
        try {
            await this.connection.execute('INSERT INTO `accounts` (user_id, username, password, cookie) VALUES (?, ?, ?, ?)', [userId, username, password, cookie]);
            console.log(`[✅] Account ${username} inserted into the database`);
        } catch (err) {
            console.log('[❌] Error inserting account: ' + err);
        }
    }

    /**
     * @returns {RobloxAccount}
     */
    async getRandomAccount() {
        const results = await this.connection.execute('SELECT * FROM Accounts ORDER BY rand() LIMIT 1');
        const row = results[0][0];
        const account = new RobloxAccount(row.Username, row.UserId, row.Password, row.Cookie);

        return account;
    }

}

export default new DBUtil();