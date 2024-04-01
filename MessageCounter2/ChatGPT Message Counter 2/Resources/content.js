// content.js
let typingStartTime = 0;
let lastTypingTime = 0;
let typingTimer;
let typedCharacters = 0; // Characters typed
let pastedCharacters = 0; // Characters pasted, each paste action counts as 1
let sendButtonClicked = false;

// Resets tracking variables and clears the timer
function resetTypingTracking() {
    typingStartTime = 0;
    lastTypingTime = 0;
    typedCharacters = 0;
    pastedCharacters = 0;
    clearTimeout(typingTimer);
}

// Checks the typing status and decides on incrementing the counter
function checkTypingStatus() {
    const now = Date.now();
    const timeSinceLastTyping = now - lastTypingTime;
    const timeSinceTypingStarted = now - typingStartTime;

    // Adjusted condition: Requires at least two typed characters, not counting pastes
    if (typedCharacters >= 2 && !sendButtonClicked) {
        if ((timeSinceTypingStarted >= 5000 && timeSinceLastTyping <= 45000) ||
            (pastedCharacters > 0 && typedCharacters + pastedCharacters >= 2)) {
            incrementCounter();
            resetTypingTracking();
        }
    }
}

// Increments the counter by sending a message to the background script
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

// Listens for typing, paste events, and Command-Enter to update character counts accordingly
function setupInputListeners() {
    document.addEventListener('keydown', event => {
        // Check for Command-Enter combination
        if (event.metaKey && event.key === 'Enter') {
            console.log('Command-Enter pressed');
            incrementCounter(); // Directly increment the message count
            return; // Prevent further processing
        }

        const now = Date.now();
        if (!typingStartTime) typingStartTime = now;
        lastTypingTime = now;
        typedCharacters++; // Increment for each keydown event
        
        clearTimeout(typingTimer);
        typingTimer = setTimeout(checkTypingStatus, 45000); // Adjust timer to 45 seconds
        
        sendButtonClicked = false;
    });

    document.addEventListener('paste', event => {
        const now = Date.now();
        if (!typingStartTime) typingStartTime = now;
        lastTypingTime = now;
        pastedCharacters = 1; // Treat each paste action as a single character increment
        
        clearTimeout(typingTimer);
        // Do not automatically start the checkTypingStatus timer here
        
        sendButtonClicked = false;
    });
}

setupInputListeners();

// Attaches a listener to the send button for click events
function attachSendButtonListener() {
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            console.log("[Log] Send button clicked.");
            sendButtonClicked = true;
            resetTypingTracking();
            incrementCounter();
        });
    } else {
        console.warn("Send button not found.");
    }
}

attachSendButtonListener();
const observer = new MutationObserver(mutations => {
    attachSendButtonListener();
});
observer.observe(document.body, { childList: true, subtree: true });

// Cleanup on page unload
window.addEventListener('unload', () => observer.disconnect());
