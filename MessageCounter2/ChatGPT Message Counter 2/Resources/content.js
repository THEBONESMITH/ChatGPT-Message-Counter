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

    // Scenario when typing has begun and it's been 5 to 45 seconds since last typing
    if (timeSinceTypingStarted >= 5000 && timeSinceLastTyping <= 45000) {
        if (!sendButtonClicked) {
            incrementCounter();
            resetTypingTracking();
        }
    } else if (timeSinceLastTyping > 45000 && timeSinceLastTyping <= 120000) {
        // Wait for additional typing within two minutes
        if (additionalCharactersTyped >= 5) {
            if (!sendButtonClicked) {
                incrementCounter();
                resetTypingTracking();
            }
        }
    }
}

// Simulate message count increment
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
    if (!typingStartTime) typingStartTime = now; // Mark the start of typing
    lastTypingTime = now;
    additionalCharactersTyped++;

    clearTimeout(typingTimer); // Clear existing timer
    typingTimer = setTimeout(checkTypingStatus, 45000); // Set new timer

    // Reset the send button clicked flag with each typing activity
    sendButtonClicked = false;
});

// Example log listener - adjust based on actual implementation
console.log = (function(logFunc) {
    return function() {
        if (arguments[0] === "[Log] Send button clicked. (content.js, line 27)") {
            sendButtonClicked = true;
            resetTypingTracking();
        }
        logFunc.apply(console, arguments);
    };
})(console.log);
