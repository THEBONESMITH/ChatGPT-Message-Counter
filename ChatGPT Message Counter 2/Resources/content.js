let sendButtonClicked = false;

// Function to attach a listener to the 'Continue' button
function attachContinueButtonListener() {
    const continueButton = document.querySelector('button.btn');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            console.log("[Log] Continue button clicked.");
            incrementCounter();
        });
    } else {
        console.warn("Continue button not found.");
    }
}

// Function to attach a listener to the 'Save & Submit' button
function attachSaveAndSubmitButtonListener() {
    // This selector targets the div containing 'Save & Submit' based on its text content
    const saveSubmitButton = Array.from(document.querySelectorAll('div')).find(el => el.textContent.includes('Save & Submit'));
    if (saveSubmitButton) {
        saveSubmitButton.addEventListener('click', () => {
            console.log("[Log] Save & Submit button clicked.");
            incrementCounter();
        });
    } else {
        console.warn("Save & Submit button not found.");
    }
}

// Function to attach a listener to the 'Regenerate' button
function attachRegenerateButtonListener() {
    // Use the unique characteristics of the 'Regenerate' button to find and attach an event listener
    const regenerateButton = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === 'Regenerate');
    if (regenerateButton) {
        regenerateButton.addEventListener('click', () => {
            console.log("[Log] Regenerate button clicked.");
            // Increment counter when the 'Regenerate' button is clicked
            incrementCounter();
        });
    } else {
        console.warn("Regenerate button not found.");
    }
}

/*
// Function to reset typing tracking
function resetTypingTracking() {
    typingStartTime = 0;
    lastTypingTime = 0;
    additionalCharactersTyped = 0;
    clearTimeout(typingTimer);
}
*/

/*
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
*/

function incrementCounter() {
    console.log('Counter incremented by:', new Error().stack);
    chrome.runtime.sendMessage({incrementCount: true}, response => {
        if (chrome.runtime.lastError) {
            console.error('Error sending increment count message:', chrome.runtime.lastError);
        } else {
            console.log('Increment count message sent successfully', response);
        }
    });
}

/*
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
*/

// Function to attach a listener to the send button
function attachSendButtonListener() {
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            console.log("[Log] Send button clicked.");
            sendButtonClicked = true;
            incrementCounter();
        });
    } else {
        console.warn("Send button not found.");
    }
}

// Attempt to attach the send button listener immediately and on DOM changes
attachSendButtonListener();
attachRegenerateButtonListener();
attachSaveAndSubmitButtonListener();

const observer = new MutationObserver(mutations => {
    // Ensure that previous listeners are removed
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    if (sendButton) {
        sendButton.removeEventListener('click', handleSendButtonClick);
        sendButton.addEventListener('click', handleSendButtonClick);
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Throttle function to limit the frequency of observer executions
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

const observer = new MutationObserver(throttle(mutations => {
    // Event listener reattachment logic here
}, 1000));

// Clean up observer on page unload
window.addEventListener('unload', () => observer.disconnect());
