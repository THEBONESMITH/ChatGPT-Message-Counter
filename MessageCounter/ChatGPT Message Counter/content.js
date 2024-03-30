// content.js

// Example function to detect when a message is manually sent
function detectSendMessage() {
    const sendButton = document.querySelector('button[data-testid="send-button"]');

    if (sendButton) {
        sendButton.addEventListener("click", function() {
            // Sending 'messageSent' to increment the counter
            browser.runtime.sendMessage({ message: 'messageSent' });
        });
    } else {
        console.log("Send button not found.");
    }
}

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', detectSendMessage);
} else {
    detectSendMessage();
}
