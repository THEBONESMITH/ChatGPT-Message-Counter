// In content.js
console.log("Content script loaded.");

function tryAttachListener() {
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    if (sendButton && !sendButton.dataset.listenerAttached) {
        console.log("Attaching listener to send button.");
        sendButton.dataset.listenerAttached = 'true';
        sendButton.addEventListener('click', () => {
            console.log("Send button clicked.");
            chrome.runtime.sendMessage({incrementCount: true}, function(response) {
                if (chrome.runtime.lastError) {
                    console.log('Error:', chrome.runtime.lastError);
                } else {
                    console.log('Message count incremented to:', response.messageCount);
                }
            });
        });
    } else if (!sendButton) {
        console.log("Send button not found. Waiting for it...");
    } else {
        console.log("Listener already attached to send button.");
    }
}

// Initialize observer and attempt to attach the listener
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) tryAttachListener();
    });
});
observer.observe(document.body, { childList: true, subtree: true });
tryAttachListener();

// Clean up the observer to avoid memory leaks especially in Single Page Applications (SPAs)
window.addEventListener('unload', () => observer.disconnect());
