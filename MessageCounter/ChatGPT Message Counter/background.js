let messageCounter = safari.extension.settings.messageCounter || 0;
let startTime = safari.extension.settings.startTime || new Date().getTime();

function resetCounterIfNecessary() {
    const now = new Date().getTime();
    if (now - startTime >= 10800000) { // 3 hours in milliseconds
        messageCounter = 0;
        startTime = now;
        safari.extension.settings.messageCounter = 0;
        safari.extension.settings.startTime = now;
    }
}

// Listen for messages from the content script
safari.application.addEventListener('message', function(event) {
    if (event.name === 'messageSent') {
        resetCounterIfNecessary();
        messageCounter++;
        safari.extension.settings.messageCounter = messageCounter;
        // No need to send back a message if you're only updating the counter in the background.
    } else if (event.name === 'getCount') {
        resetCounterIfNecessary();
        // Send the current count to the popover
        event.target.page.dispatchMessage('updateCount', messageCounter);
    }
}, false);
