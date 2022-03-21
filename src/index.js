import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import DBUtil from './DBUtil.js';
import RobloxUtil from './rbx/RobloxUtils.js';
import cors from 'cors';

const app = express();

app.options('*', cors());

app.use(express.static('web/'));

app.get('/create', async (req, res) => {
  const captcha = req.query.captcha;
  const captchaId = req.query.captchaId;

  if (!captcha || !captchaId) {
    res.json({ success: false, error: 'Missing captcha' });
    return;
  }

  const account = await RobloxUtil.createAccount(captcha, captchaId);

  if (!account) {
    return res.json({ success: false, userId: 'Failed to create account!' });
  }

  await DBUtil.addAccount(
    account.userId,
    account.username,
    account.password,
    account.cookie
  );

  res.json({ success: true, userId: account.userId });
});

app.get('/gen', async (_, res) => {
  const account = await DBUtil.getRandomAccount();

  res.json({ success: true, account });
});

app.get('/accounts', async (_, res) => {
  const accounts = await DBUtil.getAllAccounts();

  res.json({ success: true, accounts });
});

app.get('/field_data', async (_, res) => {
  res.send(await RobloxUtil.getFieldData());
});

(async () => {
  if (!(await DBUtil.connect())) return;
  await DBUtil.setupDB();

  app.listen(process.env.WEB_PORT, () => {
    console.log(
      '[✅] Web app started on http://localhost:' + process.env.WEB_PORT
    );
  });
})();
