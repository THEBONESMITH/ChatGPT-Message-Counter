// popup.js
document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ getCount: true }, (response) => {
        if (chrome.runtime.lastError) {
            document.getElementById('count').textContent = 'Error fetching data';
        } else {
            document.getElementById('count').textContent = `${response.messagesSentLast3Hours} messages sent in the last 3 hours. Next update in ${response.nextUpdateInMinutes} minutes.`;
        }
    });
});
