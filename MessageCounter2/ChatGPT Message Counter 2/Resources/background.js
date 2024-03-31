// In background.js
let messageCount = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.incrementCount) {
        // Increment your counter here
        console.log('Incrementing message count');
        // Let's pretend we increment a counter here
        let newCount = ++messageCount; // Assuming messageCount is defined elsewhere

        // Send the new count back to the sender
        sendResponse({messageCount: newCount});

        // Return true to indicate you're sending a response asynchronously
        // (even if you actually send it right away, this is safe to do)
        return true;
    }
});
