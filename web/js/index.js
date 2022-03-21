let accounts = 0;
const loadingElem = document.getElementById('loading');

function fadeOutLoading() {
  let opacity = 100;
  let interval = setInterval(() => {
    if (opacity <= 0) {
      loadingElem.style.display = 'none';
      clearInterval(interval);
      return;
    }
    opacity--;
    loadingElem.style.opacity = opacity + '%';
  }, 5);
}

function fadeInLoading() {
  let opacity = 0;
  let interval = setInterval(() => {
    if (opacity >= 100) {
      loadingElem.style.display = 'flex';
      clearInterval(interval);
      return;
    }
    opacity++;
    loadingElem.style.opacity = opacity + '%';
  }, 5);
}

window.addEventListener('message', ({ data }) => {
  if (data === 'done') {
    document.getElementById('captcha-frame').contentWindow.location.reload();
    document.getElementById('accountstxt').textContent =
      'Accounts: ' + ++accounts;
    document.getElementById('loading').style.display = 'flex';
    fadeInLoading();
  } else if (data === 'load') {
    fadeOutLoading();
  }
});
