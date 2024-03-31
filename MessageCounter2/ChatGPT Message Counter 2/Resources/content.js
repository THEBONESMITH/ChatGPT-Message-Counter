// content.js
console.log("Content script loaded.");

function tryAttachListener() {
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    if (sendButton && !sendButton.dataset.listenerAttached) {
        console.log("Attaching listener to send button.");
        // Mark the button to avoid attaching another listener
        sendButton.dataset.listenerAttached = 'true';
        sendButton.addEventListener('click', () => {
            console.log("Send button clicked.");
            // Send a message to the background script to increment the count
            chrome.runtime.sendMessage({ incrementCount: true }, (response) => {
                console.log('Message count incremented to:', response.messageCount);
            });
        });
    } else if (!sendButton) {
        console.log("Send button not found. Waiting for it...");
        // Wait and try again. It's important in dynamic content or SPA where elements load asynchronously
    } else {
        console.log("Listener already attached to send button.");
    }
}

// Observe the DOM for changes to detect the send button when it gets added dynamically
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) tryAttachListener();
    });
});

// Start observing the document body for added nodes
observer.observe(document.body, { childList: true, subtree: true });

// Attempt to attach the listener immediately in case the button is already present
tryAttachListener();

// Clean up the observer to avoid memory leaks especially in Single Page Applications (SPAs)
window.addEventListener('unload', () => observer.disconnect());
