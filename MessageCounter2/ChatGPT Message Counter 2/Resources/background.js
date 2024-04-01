// background.js
// background.js
const DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

function updateMessageTimestamps() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['messageTimestamps'], result => {
            const now = Date.now();
            let messageTimestamps = result.messageTimestamps || [];
            messageTimestamps = messageTimestamps.filter(timestamp => now - timestamp < DURATION_MS);

            chrome.storage.local.set({ messageTimestamps }, () => {
                resolve(messageTimestamps); // Resolve the promise with the updated timestamps
            });
        });
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async () => { // Make the callback function async
        try {
            if (request.incrementCount) {
                const result = await chrome.storage.local.get(['messageTimestamps']);
                const now = Date.now();
                let messageTimestamps = result.messageTimestamps || [];
                messageTimestamps.push(now);

                await chrome.storage.local.set({ messageTimestamps });
                // After setting, update and clean timestamps then send the updated count
                messageTimestamps = await updateMessageTimestamps();
                // No need to pass sendResponse to updateMessageTimestamps; directly use the result
                sendResponse({ messagesSentLast3Hours: messageTimestamps.length });
            } else if (request.getCount) {
                const messageTimestamps = await updateMessageTimestamps(); // Use the promise result directly
                const messagesSentLast3Hours = messageTimestamps.length;
                let nextUpdateInMinutes = 0;
                if (messagesSentLast3Hours > 0) {
                    const oldestTimestamp = messageTimestamps[0];
                    const threeHoursFromFirstMessage = oldestTimestamp + DURATION_MS;
                    nextUpdateInMinutes = Math.ceil((threeHoursFromFirstMessage - Date.now()) / (60 * 1000));
                }
                sendResponse({ messagesSentLast3Hours, nextUpdateInMinutes });
            }
        } catch (error) {
            console.error("Error in message listener:", error);
            sendResponse({ error: "Failed to process request" });
        }
    })();
    return true; // Indicates an asynchronous response
});

