// background.js

// Updates message timestamps, filtering out those older than 3 hours, and calls a callback with updated data
function updateMessageTimestamps(callback) {
    chrome.storage.local.get(['messageTimestamps'], result => {
        const now = Date.now();
        const threeHoursAgo = now - (3 * 60 * 60 * 1000);
        let messageTimestamps = result.messageTimestamps || [];
        messageTimestamps = messageTimestamps.filter(timestamp => timestamp > threeHoursAgo);

        // Save the filtered list back to storage
        chrome.storage.local.set({ messageTimestamps }, () => {
            if (typeof callback === 'function') {
                callback(messageTimestamps);
            }
        });
    });
}

// Adds the current timestamp to the stored list and updates the message timestamps
function addCurrentTimestampAndUpdate(callback) {
    chrome.storage.local.get(['messageTimestamps'], result => {
        const now = Date.now();
        const messageTimestamps = result.messageTimestamps || [];
        messageTimestamps.push(now);

        // Save the updated list and then filter it
        chrome.storage.local.set({ messageTimestamps }, () => {
            updateMessageTimestamps(callback);
        });
    });
}

// Listens for messages from content scripts or the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.incrementCount) {
        addCurrentTimestampAndUpdate(messageTimestamps => {
            sendResponse({ success: true });
        });
        return true; // Indicates asynchronous response
    } else if (request.getCount) {
        updateMessageTimestamps(messageTimestamps => {
            const now = Date.now();
            const threeHoursAgo = now - (3 * 60 * 60 * 1000);
            const messagesSentLast3Hours = messageTimestamps.length;
            let nextUpdateInMinutes = 0;

            if (messageTimestamps.length > 0) {
                const oldestTimestamp = messageTimestamps[0];
                const timeUntilNextDrop = (oldestTimestamp + (3 * 60 * 60 * 1000)) - now;
                nextUpdateInMinutes = Math.ceil(timeUntilNextDrop / (60 * 1000));
            }

            sendResponse({ messagesSentLast3Hours, nextUpdateInMinutes });
        });
        return true; // Indicates asynchronous response
    }
    return false; // If neither condition is met, no asynchronous response is indicated
});

// Ensure to handle the cleanup of old messages periodically or on specific triggers to maintain performance
