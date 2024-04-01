# ChatGPT Message Counter Safari Extension

## Description

The ChatGPT Message Counter is a sophisticated Safari Extension designed to help users monitor their messaging activity by counting the number of messages sent within a dynamic three-hour window. This tool employs smart detection mechanisms to estimate message sends, offering a unique approach to managing communication frequency.

## Key Features

- **Intelligent Message Detection**: Employs smart typing detection and send button click recognition to estimate message sends, enhancing reliability where direct send button clicks might not always be registered.
- **Three-Hour Rolling Window**: Utilizes a rolling three-hour window for counting messages, providing continuous real-time updates without simply resetting every three hours.
- **Persistent Memory**: Leverages persistent storage to maintain count accuracy, ensuring uninterrupted tracking of message counts even across browser restarts.

## Installation

1. Download the extension file from the provided repository or extension store.
2. In Safari, go to `Safari > Preferences > Extensions`.
3. Drag and drop the downloaded file into the Extensions panel.
4. Enable the ChatGPT Message Counter by checking its box in the Extensions list.

## Usage

After installation, the extension will automatically start tracking message activity. To view your message count:

1. Click on the extension icon in the Safari toolbar.
2. A popup will display the current count of messages sent in the last three hours and the time left until the counter updates.

### Detailed Logic

- **Typing vs. Pasting**: The extension differentiates between typing and pasting actions. While each pasting action counts as a single character, at least two characters need to be typed to qualify as a potential message send.
- **Dynamic Three-Hour Tracking**: Instead of resetting every three hours, the counter updates based on a rolling window, ensuring that only messages sent within the last three hours are counted.
- **Persistent Tracking Across Sessions**: The use of Chrome's local storage ensures that the message count remains accurate and persistent, even if the browser is restarted.

## Support and Feedback

For support, questions, or feedback, please contact us at [Support Email](mailto:jumps_chip_0u@icloud.com). Your suggestions are valuable to us and help in continuously improving the extension.

## Contributing

We welcome contributions to the ChatGPT Message Counter! Feel free to fork the repository, make your changes, and submit pull requests with your enhancements.

## License

This extension is released under the MIT License. See the LICENSE file in the repository for more details.
