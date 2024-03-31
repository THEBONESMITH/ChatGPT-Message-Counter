// popup.js

document.addEventListener('DOMContentLoaded', function() {
    updateMessageCount();
    setInterval(updateMessageCount, 60000); // Update every minute
});

function updateMessageCount() {
    chrome.runtime.sendMessage({ getCount: true }, (response) => {
        if (response) {
            const { messagesSentLast5Minutes, nextUpdateInMinutes } = response;
            document.getElementById('count').textContent = `${messagesSentLast5Minutes} messages sent in the last 5 minutes. Next update in ${nextUpdateInMinutes} minutes.`;
        } else if (chrome.runtime.lastError) {
            console.error('Error fetching message count:', chrome.runtime.lastError);
            document.getElementById('count').textContent = 'Error fetching message count';
        }
    });
}
