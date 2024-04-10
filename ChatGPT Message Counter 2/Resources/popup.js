// popup.js
document.addEventListener('DOMContentLoaded', () => {
    updateMessageCount();
    document.getElementById('updateButton').addEventListener('click', () => {
        // Simulate a "send message" event
        chrome.runtime.sendMessage({ incrementCount: true }, updateMessageCount);
    });
});

function updateMessageCount() {
    chrome.runtime.sendMessage({ getCount: true }, response => {
        if (response) {
            const { messagesSentLast3Hours, nextUpdateInMinutes } = response;
            document.getElementById('count').textContent = `${messagesSentLast3Hours} messages sent in the last 3 hours. Next update in ${nextUpdateInMinutes} minutes.`;
        } else {
            // Handle error or no response scenario
            console.error('Error fetching message count:', chrome.runtime.lastError);
            document.getElementById('count').textContent = 'Error fetching message count';
        }
    });
}
