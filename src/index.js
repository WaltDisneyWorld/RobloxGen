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
  const account = await RobloxUtil.createAccount(captcha, captchaId);

  if (account === null) {
    return res.json({ success: false, userId: 'Failed to create account!' });
  }

  await DBUtil.addAccount(
    account.userId,
    account.username,
    account.password,
    account.cookie
  );

  res.send({ success: true, userId: account.userId });
});

app.get('/gen', async (_, res) => {
  const account = await DBUtil.getRandomAccount();

  res.json({ success: true, account });
});

app.get('/field_data', async (_, res) => {
  res.send(await RobloxUtil.getFieldData());
});

(async () => {
  if (!(await DBUtil.connect())) return;
  await DBUtil.setupDB();

  app.listen(process.env.WEB_PORT, () => {
    console.log(
      '[✅] Listening on port http://localhost:' + process.env.WEB_PORT
    );
  });
})();
