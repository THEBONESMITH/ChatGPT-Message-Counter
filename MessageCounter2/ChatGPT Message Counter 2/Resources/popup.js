// popup.js
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({getCount: true}, function(response) {
        if (response && typeof response.messageCount !== 'undefined') {
            document.getElementById('count').textContent = response.messageCount.toString();
            console.log('Displaying updated count:', response.messageCount);
        } else {
            console.error('Failed to fetch the message count.');
            document.getElementById('count').textContent = 'Error';
        }
    });
});
