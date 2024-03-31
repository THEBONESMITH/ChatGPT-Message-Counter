let typingStartTime = 0;
let lastTypingTime = 0;
let typingTimer;
let additionalCharactersTyped = 0;
let sendButtonClicked = false;

// Function to reset typing tracking
function resetTypingTracking() {
    typingStartTime = 0;
    lastTypingTime = 0;
    additionalCharactersTyped = 0;
    clearTimeout(typingTimer);
}

// Function to check typing status and decide on incrementing the counter
function checkTypingStatus() {
    const now = Date.now();
    const timeSinceLastTyping = now - lastTypingTime;
    const timeSinceTypingStarted = now - typingStartTime;

    if (timeSinceTypingStarted >= 5000 && timeSinceLastTyping <= 45000) {
        if (!sendButtonClicked) {
            incrementCounter();
            resetTypingTracking();
        }
    } else if (timeSinceLastTyping > 45000 && timeSinceLastTyping <= 120000) {
        if (additionalCharactersTyped >= 5) {
            if (!sendButtonClicked) {
                incrementCounter();
                resetTypingTracking();
            }
        }
    }
}

// Function to increment the counter
function incrementCounter() {
    console.log('Counter incremented due to typing activity.');
    chrome.runtime.sendMessage({incrementCount: true}, response => {
        if (chrome.runtime.lastError) {
            console.error('Error sending increment count message:', chrome.runtime.lastError);
        } else {
            console.log('Increment count message sent successfully', response);
        }
    });
}

// Set up event listener for typing activity
document.addEventListener('input', event => {
    const now = Date.now();
    if (!typingStartTime) typingStartTime = now;
    lastTypingTime = now;
    additionalCharactersTyped++;

    clearTimeout(typingTimer);
    typingTimer = setTimeout(checkTypingStatus, 45000);

    sendButtonClicked = false;
});

// Function to attach a listener to the send button
function attachSendButtonListener() {
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            console.log("[Log] Send button clicked.");
            sendButtonClicked = true;
            resetTypingTracking();
            // Directly increment the counter on send button click
            incrementCounter();
        });
    } else {
        console.warn("Send button not found.");
    }
}

// Attempt to attach the send button listener immediately and on DOM changes
attachSendButtonListener();
const observer = new MutationObserver(mutations => {
    attachSendButtonListener();
});
observer.observe(document.body, { childList: true, subtree: true });

// Clean up observer on page unload
window.addEventListener('unload', () => observer.disconnect());
