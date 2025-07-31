LeetCode Mentor Chrome Extension
 A Chrome extension that provides AI-powered coding guidance for LeetCode problems, featuring a floating mentor panel with hints, approach suggestions, pattern recognition, and complexity analysis. Built with JavaScript, HTML, CSS, and integrated with the Gemini 1.5-flash API.

 ## Features
 - **Interactive Mentor Panel**: A floating panel on LeetCode problem pages with a chat interface and quick-action buttons (Hint, Approach, Pattern, Complexity, Walkthrough, Pseudocode, Debug).
 - **Dynamic Problem Analysis**: Extracts problem details (title, description, tags) to provide context-aware AI responses.
 - **Responsive UI**: Modern design with Tailwind-inspired CSS, smooth animations, and a user-friendly chat system.
 - **Context Menu Integration**: Right-click to get coding help for selected text on LeetCode pages.
 - **API Integration**: Securely manages Gemini API keys using Chrome storage APIs for seamless AI interactions.

 ## Tech Stack
 - **Languages**: JavaScript, HTML, CSS
 - **APIs**: Chrome Extension APIs, Gemini 1.5-flash API
 - **Tools**: Chrome Developer Tools, Git

 ## Installation
 1. Clone the repository:
    ```bash
    git clone https://github.com/calebrobinson11/leetcode-mentor-extension.git
    ```
 2. Open Chrome and navigate to `chrome://extensions/`.
 3. Enable **Developer mode** (top-right toggle).
 4. Click **Load unpacked** and select the `leetcode-mentor-extension` folder.
 5. Obtain a Gemini API key from [Google's Generative AI Platform](https://ai.google.dev/).
 6. Open the extension's popup and enter your API key to enable AI features.

 ## Usage
 - Navigate to any LeetCode problem page (`https://leetcode.com/problems/*`).
 - The mentor panel will appear on the right side of the screen.
 - Use quick-action buttons (e.g., "Get Hint", "Approach") or type custom questions in the chat input.
 - Toggle the panel using the `−`/`+` button in the header.
 - Right-click selected text on LeetCode pages and choose "Get Coding Help" for contextual assistance.

 ## Screenshots
 *(Add screenshots to the `screenshots/` folder and link them here, e.g.:)*
 ![Mentor Panel](screenshots/mentor-panel.png)
 ![Popup Interface](screenshots/popup.png)

 ## Contributing
 Contributions are welcome! Please fork the repository and submit a pull request with your changes.

 1. Fork the repository.
 2. Create a new branch (`git checkout -b feature/your-feature`).
 3. Commit your changes (`git commit -m 'Add your feature'`).
 4. Push to the branch (`git push origin feature/your-feature`).
 5. Open a pull request.

 ## License
 This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

 ## Contact
 Caleb Robinson  
 Email: clro26@uky.edu 
 LinkedIn: [linkedin.com/in/calebrobinson2](https://www.linkedin.com/in/calebrobinson2)
