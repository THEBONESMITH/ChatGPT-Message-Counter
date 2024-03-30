//backgound.js

// Initialize or retrieve the message counter and the start time
let messageCounter = parseInt(localStorage.getItem('messageCounter') || 0, 10);
let startTime = parseInt(localStorage.getItem('startTime') || Date.now(), 10);

function resetCounterIfNecessary() {
    const now = Date.now();
    if (now - startTime >= 10800000) { // 3 hours in milliseconds
        messageCounter = 0;
        startTime = now;
        localStorage.setItem('messageCounter', messageCounter.toString());
        localStorage.setItem('startTime', startTime.toString());
    }
}

// Listen for messages from the content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message === 'messageSent') {
        resetCounterIfNecessary();
        messageCounter++;
        localStorage.setItem('messageCounter', messageCounter.toString());
        // Send the updated count back to the sender
        sendResponse({ counter: messageCounter });
        return true; // Indicate that we will send a response asynchronously
    }
    return false; // No need to return a response
});

// Optional: Add a listener to provide the current count to the popup
browser.runtime.sendMessage({ message: 'getCount' }).then(response => {
    document.getElementById('messageCount').textContent = response.counter;
}).catch(error => {
    console.error('Error getting message count:', error);
});

