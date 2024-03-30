// background.js

// Initialize or retrieve the message counter and the start time
let messageCounter = parseInt(localStorage.getItem('messageCounter') || '0', 10);
let startTime = parseInt(localStorage.getItem('startTime') || Date.now(), 10);

function resetCounterIfNecessary() {
    const now = Date.now();
    // 3 hours in milliseconds
    if (now - startTime >= 10800000) {
        messageCounter = 0;
        startTime = now;
        localStorage.setItem('messageCounter', messageCounter.toString());
        localStorage.setItem('startTime', startTime.toString());
    }
}

// Listen for messages from the content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message === 'getCount') {
        resetCounterIfNecessary();
        sendResponse({ counter: messageCounter });
        return true;
    } else if (message.message === 'messageSent') {
        resetCounterIfNecessary();
        messageCounter++;
        localStorage.setItem('messageCounter', messageCounter.toString());
        // No need to send a response here if you're just incrementing the counter
    }
    return false;
});

