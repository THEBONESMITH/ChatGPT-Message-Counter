// Example function to detect when a message is manually sent
function detectSendMessage() {
    // Assuming 'button' is the tag of the send button and it contains an SVG as a child
    const sendButton = document.querySelector('button > svg [d="M7 11L12 6L17 11M12 18V7"]');

    if (sendButton && sendButton.closest('button')) {
        // Add an event listener to the send button
        sendButton.closest('button').addEventListener("click", function() {
            // When the button is clicked, dispatch a message to the background script
            browser.runtime.sendMessage({ message: 'messageSent' }).then(response => {
                console.log('Background script response:', response);
            }).catch(error => {
                console.error('Error sending message to background script:', error);
            });
        });
    } else {
        console.log("Send button not found.");
    }
}

// Call the function when the content script loads
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', detectSendMessage);
} else {
    detectSendMessage();
}
