// In background.js
let messageCount = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.incrementCount) {
        messageCount++;
        console.log('Message count incremented:', messageCount);
        sendResponse({messageCount: messageCount});
        return true; // Indicating asynchronous response (optional in this case since response is immediate)
    } else if (request.getCount) {
        console.log('Sending current count:', messageCount);
        sendResponse({messageCount: messageCount});
        return true; // Ensure this line is present to handle the response correctly
    }
    return false; // If neither incrementCount nor getCount, do nothing.
});
