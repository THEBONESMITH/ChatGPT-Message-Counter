console.log("Content script loaded.");

let sendButtonFound = false; // Flag to indicate if the send button has been found

function attachSendButtonListener() {
    if (!sendButtonFound) {
        const sendButton = document.querySelector('button[data-testid="send-button"]');
        if (sendButton && !sendButton.dataset.listenerAttached) {
            console.log("Attaching listener to send button.");
            sendButton.dataset.listenerAttached = 'true';
            sendButton.addEventListener('click', () => {
                console.log("Send button clicked.");
                chrome.runtime.sendMessage({ incrementCount: true }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.log('Error:', chrome.runtime.lastError);
                    } else {
                        console.log('Message count updated:', response.messagesSentLast3Hours);
                    }
                });
            });
            sendButtonFound = true; // Update flag
        } else if (!sendButton) {
            console.log("Send button not found. Will retry...");
        }
    }
}

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (!sendButtonFound || mutation.addedNodes.length || mutation.attributeList) {
            attachSendButtonListener();
        }
    });
});

// Start observing the document body for added nodes and attribute changes
observer.observe(document.body, { childList: true, subtree: true, attributes: true });

// Attempt to attach the listener immediately in case the button is already present
attachSendButtonListener();
