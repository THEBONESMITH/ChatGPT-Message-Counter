// background.js

let messageCount = 0;

// On install, set up the initial state.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ messageCount: 0 });
});

// Listen for messages from content scripts.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.incrementCount) {
    // Increment the count and update storage.
    messageCount++;
    chrome.storage.local.set({ messageCount });
    sendResponse({ messageCount });
  } else if (request.getCount) {
    // Respond with the current count.
    chrome.storage.local.get("messageCount", (data) => {
      sendResponse({ messageCount: data.messageCount || 0 });
    });
  }
  return true; // Keep the messaging channel open for asynchronous response.
});

