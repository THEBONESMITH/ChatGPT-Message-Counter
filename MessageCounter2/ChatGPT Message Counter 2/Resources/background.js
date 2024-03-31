// background.js
let messageTimestamps = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const threeHoursAgo = Date.now() - (3 * 60 * 60 * 1000); // 3 hours in milliseconds

    if (request.incrementCount) {
        messageTimestamps.push(Date.now());
        messageTimestamps = messageTimestamps.filter(timestamp => timestamp > threeHoursAgo);
        console.log('Message count within the last 3 hours:', messageTimestamps.length);
        sendResponse({ messageCount: 40 - messageTimestamps.length, nextReset: threeHoursAgo });
    } else if (request.getCount) {
        messageTimestamps = messageTimestamps.filter(timestamp => timestamp > threeHoursAgo);
        console.log('Sending current count within the last 3 hours:', messageTimestamps.length);
        sendResponse({ messageCount: 40 - messageTimestamps.length, nextReset: threeHoursAgo });
    }
    return true; // Indicating an asynchronous response
});
