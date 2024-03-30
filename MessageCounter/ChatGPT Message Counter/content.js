// Example function to detect when a message is manually sent
function detectSendMessage() {
    // Assuming 'button' is the tag of the send button and it contains an SVG as a child
    var sendButton = document.querySelector('button > svg [d="M7 11L12 6L17 11M12 18V7"]');

    if (sendButton && sendButton.closest('button')) {
        // Add an event listener to the send button
        sendButton.closest('button').addEventListener("click", function() {
            // When the button is clicked, dispatch a message to the background script
            // The actual sending of the message is handled by the user interaction and not automated
            safari.extension.dispatchMessage('messageSent');
        });
    } else {
        console.log("Send button not found.");
    }
}

// Call the function when the content script loads
document.addEventListener('DOMContentLoaded', detectSendMessage);

// Listen for a response from the background script
safari.self.addEventListener('message', function(event) {
    if (event.name === 'canSendMessageResponse') {
        if (event.message.canSend) {
            console.log("Message can be sent.");
            // Code to actually send the message goes here, e.g., trigger the form submission
            // This might be a form submit or clicking the actual send button programmatically
        } else {
            console.log("Message limit reached.");
            // Show a warning to the user here
        }
    }
}, false);
