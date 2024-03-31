// In content.js
console.log("Content script loaded.");

function attachSendButtonListener() {
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
                    console.log('Message count updated:', response.messagesSentLast3Hours);
                }
            });
        });
    } else if (!sendButton) {
        console.log("Send button not found. Will retry...");
    } else {
        console.log("Listener already attached to send button.");
    }
}

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length || mutation.attributeList) {
            attachSendButtonListener();
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true, attributes: true });

// Attempt to attach listener immediately in case the button is already present
attachSendButtonListener();

// Clean up observer on page unload to prevent memory leaks
window.addEventListener('unload', () => observer.disconnect());
