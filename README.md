# AIEverywhere - Text and Code Enhancer

## Overview

This Chrome extension leverages the power of the OpenAI API to enhance your reading, writing, and coding experience. It provides the following functionalities:

1. **Summarize Text**: Quickly get the gist of any text with concise and clear summaries.
2. **Creative Summarizations**: Enjoy creatively rephrased summaries that add a touch of flair to the original content.
3. **Generate Multiple Choice Questions**: Transform any text into a set of multiple-choice questions for studying or quizzing.
4. **Add Comments to Code**: Automatically add descriptive comments to your code to improve readability and maintainability.
5. **Improve English Writing**: Enhance your English writing with suggestions for clarity, grammar, and style improvements.

## Features

- **Text Summarization**: Highlight any text on a webpage and get a summarized version.
- **Creative Summarization**: Choose to get a more creatively rephrased summary for a different perspective on the content.
- **Multiple Choice Question Generation**: Convert paragraphs into multiple-choice questions for educational purposes.
- **Code Commenting**: Select code snippets and receive inline comments that explain each part of the code.
- **English Writing Improvement**: Highlight text and receive suggestions to improve clarity, grammar, and style.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/text-code-enhancer-extension.git
2. Navigate to the project directory:
   ```bash
   cd text-code-enhancer-extension
3. Install dependencies:
   ```bash
   npm install
4. Load the extension into Chrome:
   Open Chrome and go to chrome://extensions/
   Enable "Developer mode" using the toggle switch in the top-right corner
   Click on "Load unpacked" and select the dist folder from the project directory 

## Configuration 
1. This extension requires an API key from OpenAI. To set it up:
2. Get your OpenAI API key from the OpenAI website.
3. Create a config.js file in the src directory and add your API key:
   ```bash
   export const config = {
    OPENAI_API_KEY: 'your-api-key'
   };

## Usage

After installation, use the extension by right-clicking on any text or code on a webpage to access the enhancement features from the context menu.

## Contributing

Contributions are welcome! Please read the CONTRIBUTING.md for instructions on how to make contributions and propose changes.

## Support

For support, feature requests, or bug reporting, please open an issue on this repository.

## Security

Ensure your API key is kept confidential. Avoid exposing it in public repositories or shared spaces.
