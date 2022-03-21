let accounts = 0;

async function loadChallenge() {
  let fieldData = await (await fetch('/field_data')).text();
  const captcha = new FunCaptcha({
    public_key: 'A2A14B1D-1AF3-C791-9BBC-EE33CC7A0A6F',
    target_html: 'CAPTCHA',
    callback: async captchaToken => {
      const res = await fetch(
        '/create?captcha=' +
          captchaToken +
          '&captchaId=' +
          fieldData.split(',')[0]
      );
      window.parent.postMessage('done');
    },
    onshown: () => {
      window.parent.postMessage('load');
    },
    data: {
      blob: fieldData.split(',')[1]
    }
  });
}

async function getPublicKey() {
  const url = 'https://apis.rbxcdn.com/captcha/v1/metadata';
  const res = await fetch(url);
  const data = await res.json();
  const publicKeys = data['funCaptchaPublicKeys'];

  return publicKeys['ACTION_TYPE_WEB_SIGNUP'];
}
