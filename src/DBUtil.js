const mysql = require('mysql2/promise');
const RobloxAccount = require('./RobloxAccount');

class DBUtil {

    host
    user
    pass
    database

    /**
     * @type {mysql.Connection}
     */
    connection

    /**
     * 
     * @param {string} host 
     * @param {string} user 
     * @param {string} pass 
     * @param {string} database 
     */
    constructor(host, user, pass, database) {
        this.host = host;
        this.user = user;
        this.pass = pass;
        this.database = database;

        (async () => {
            try {
                await this._initConnection();
            } catch (err) {
                try {
                    await this.connection.connect();
                } catch (err) {
                    if (err.code == 'ER_BAD_DB_ERROR') {
                        await this._setupDatabase();
                    }
                }
            }
        })();
    }

    async _setupDatabase() {
        console.log('No ' + this.database + ' database found, creating...');
        const conn = await mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.pass
        });
        try {
            await conn.execute(`CREATE DATABASE IF NOT EXISTS \`${this.database}\``);
        } catch (ex) {
            console.log('Error creating database. Error: ' + ex.code)
        }
        await this._initConnection();
        console.log('Creating Accounts table...')
        try {
            await this.connection.execute(`
            CREATE TABLE \`Accounts\` (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                UserID BIGINT NOT NULL,
                Username VARCHAR(30) NOT NULL,
                Password VARCHAR(30) NOT NULL,
                Cookie VARCHAR(900) NOT NULL
            );`);
        } catch (ex) {
            console.log('Failed to create table. Error: ' + ex);
        }
    }

    async _initConnection() {
        this.connection = await mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.pass,
            database: this.database
        });
    }

    async addAccount(userId, username, password, cookie) {
        try {
            await this.connection.execute('INSERT INTO `Accounts` (`UserID`, `Username`, `Password`, `Cookie` ) VALUES (?, ?, ?, ?)', [userId, username, password, cookie]);
        } catch (err) {
            console.log('Error inserting account. Error: ' + err.code);
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

module.exports = (host, user, pass, database) => new DBUtil(host, user, pass, database);