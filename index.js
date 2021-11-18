const fetch = require('node-fetch');
const express = require('express');
const app = express();
const RobloxUtil = require('./RobloxUtils');
const db_config = require('./database.json')
const DBUtil = require('./DBUtil')(
    db_config.host,
    db_config.username,
    db_config.password,
    db_config.database
);

app.use(express.static('web/'))

app.get('/create', async (req, res) => {
    const captcha = req.query.captcha;
    const account = await RobloxUtil.createAccount(captcha);
    await DBUtil.addAccount(account.userId, account.username, account.password, account.cookie);

    res.send('UserId: ' + account.userId);
});

app.get('/gen', async (req, res) => {
    const account = await DBUtil.getRandomAccount();

    res.send(account.cookie);
})

app.listen(28493, () => {
    console.log('Listening on port 28493!')
})