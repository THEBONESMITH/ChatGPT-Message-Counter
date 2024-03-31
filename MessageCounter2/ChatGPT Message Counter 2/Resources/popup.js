// popup.js
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({getCount: true}, function(response) {
        if (response && typeof response.messageCount !== 'undefined') {
            document.getElementById('count').textContent = 'Messages left: ' + response.messageCount;
            const nextResetDate = new Date(response.nextReset + (3 * 60 * 60 * 1000)); // Add three hours to the oldest message time
            document.getElementById('nextReset').textContent = 'Next reset: ' + nextResetDate.toLocaleTimeString();
            console.log('Displaying updated info');
        } else {
            console.error('Failed to fetch the message count.');
            document.getElementById('count').textContent = 'Error';
            document.getElementById('nextReset').textContent = '';
        }
    });
});
