// background.js

const DURATION_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to update and clean message timestamps
function updateMessageTimestamps(callback) {
    chrome.storage.local.get(['messageTimestamps'], result => {
        const now = Date.now();
        let messageTimestamps = result.messageTimestamps || [];
        // Keep only timestamps within the last 5 minutes
        messageTimestamps = messageTimestamps.filter(timestamp => now - timestamp < DURATION_MS);

        chrome.storage.local.set({ messageTimestamps }, () => {
            if (typeof callback === 'function') {
                callback(messageTimestamps);
            }
        });
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.incrementCount) {
        // Add the current timestamp to the array in storage
        chrome.storage.local.get(['messageTimestamps'], result => {
            const now = Date.now();
            const messageTimestamps = result.messageTimestamps || [];
            messageTimestamps.push(now);
            
            // Save the updated array back to storage and send the updated count
            chrome.storage.local.set({ messageTimestamps }, () => updateMessageTimestamps(sendResponse));
        });
    } else if (request.getCount) {
        // Send the count of messages within the last 5 minutes and the next update time
        updateMessageTimestamps(messageTimestamps => {
            const messagesSentLast5Minutes = messageTimestamps.length;
            let nextUpdateInMinutes = 0;
            if (messageTimestamps.length > 0) {
                const oldestTimestamp = messageTimestamps[0];
                const fiveMinutesFromFirstMessage = oldestTimestamp + DURATION_MS;
                nextUpdateInMinutes = Math.ceil((fiveMinutesFromFirstMessage - Date.now()) / (60 * 1000));
            }
            sendResponse({ messagesSentLast5Minutes, nextUpdateInMinutes });
        });
    }
    return true; // Indicates an asynchronous response
});
