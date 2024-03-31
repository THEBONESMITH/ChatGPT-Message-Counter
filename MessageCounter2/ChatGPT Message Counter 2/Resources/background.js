// background.js
let messageTimestamps = [];

function updateMessageTimestamps() {
    const now = Date.now();
    const threeHoursAgo = now - (3 * 60 * 60 * 1000);
    // Filter out messages older than 3 hours
    messageTimestamps = messageTimestamps.filter(timestamp => timestamp > threeHoursAgo);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.incrementCount) {
        const now = Date.now();
        messageTimestamps.push(now);
    }

    updateMessageTimestamps(); // Clean up old timestamps

    const messagesSentLast3Hours = messageTimestamps.length;
    let nextUpdateInMinutes = 0;

    if (messageTimestamps.length > 0) {
        const oldestTimestamp = messageTimestamps[0];
        const threeHoursFromFirstMessage = oldestTimestamp + (3 * 60 * 60 * 1000);
        nextUpdateInMinutes = Math.ceil((threeHoursFromFirstMessage - Date.now()) / (60 * 1000));
    }

    sendResponse({ messagesSentLast3Hours, nextUpdateInMinutes });
    return true; // Keep the message channel open for async response
});
