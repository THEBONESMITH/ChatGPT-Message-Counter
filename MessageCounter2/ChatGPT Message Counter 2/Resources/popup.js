// popup.js

chrome.runtime.sendMessage({ getCount: true }, (response) => {
  document.getElementById('count').textContent = response.messageCount;
});
    