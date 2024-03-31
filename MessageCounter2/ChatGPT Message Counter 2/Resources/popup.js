// In popup.js
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({getCount: true}, function(response) {
        document.getElementById('count').textContent = response.messageCount;
    });
});

