// LeetCode Mentor Content Script
class LeetCodeMentor {
    constructor() {
        this.apiKey = '';
        this.mentorPanel = null;
        this.currentProblem = null;
        this.conversationHistory = [];
        this.init();
    }

    async init() {
        // Get API key from storage
        const result = await chrome.storage.sync.get(['geminiApiKey']);
        this.apiKey = result.geminiApiKey;

        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createMentorPanel());
        } else {
            this.createMentorPanel();
        }

        // Monitor for problem changes
        this.observeUrlChanges();
    }

    createMentorPanel() {
        if (this.mentorPanel) return;

        // Create floating mentor panel
        this.mentorPanel = document.createElement('div');
        this.mentorPanel.id = 'leetcode-mentor-panel';
        this.mentorPanel.innerHTML = `
            <div class="mentor-header">
                <h3>🧠 Your Coding Mentor</h3>
                <button id="mentor-toggle">−</button>
            </div>
            <div class="mentor-content">
                <div class="mentor-status">
                    <span id="problem-analysis">Analyzing problem...</span>
                </div>
                <div class="mentor-chat" id="mentor-chat">
                    <div class="mentor-message">
                        Hi! I'm your coding mentor. I'm here to guide you through this problem step by step. 
                        What would you like help with?
                    </div>
                </div>
                <div class="mentor-input-section">
                    <div class="quick-actions">
                        <button class="quick-btn" data-action="hint">💡 Get Hint</button>
                        <button class="quick-btn" data-action="approach">🎯 Approach</button>
                        <button class="quick-btn" data-action="pattern">🔍 Pattern</button>
                        <button class="quick-btn" data-action="complexity">⚡ Complexity</button>
                    </div>
                    <div class="chat-input-container">
                        <input type="text" id="mentor-input" placeholder="Ask me anything about this problem...">
                        <button id="mentor-send">Send</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.mentorPanel);
        this.attachEventListeners();
        this.analyzeProblem();
    }

    attachEventListeners() {
        // Toggle panel
        document.getElementById('mentor-toggle').addEventListener('click', () => {
            const content = document.querySelector('.mentor-content');
            const toggle = document.getElementById('mentor-toggle');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggle.textContent = '−';
            } else {
                content.style.display = 'none';
                toggle.textContent = '+';
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Chat input
        const input = document.getElementById('mentor-input');
        const sendBtn = document.getElementById('mentor-send');

        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    async analyzeProblem() {
        const problemTitle = document.querySelector('[data-cy="question-title"]')?.textContent;
        const problemDescription = document.querySelector('[data-track-load="description_content"]')?.textContent;
        
        if (!problemTitle) return;

        this.currentProblem = {
            title: problemTitle,
            description: problemDescription,
            difficulty: document.querySelector('[diff]')?.textContent,
            tags: Array.from(document.querySelectorAll('[class*="tag"]')).map(el => el.textContent)
        };

        const statusEl = document.getElementById('problem-analysis');
        statusEl.textContent = `Ready to help with: ${problemTitle}`;
    }

    // OLD CODE - Replace this:
async handleQuickAction(action) {
    const prompts = {
        hint: "Give me a subtle hint about the approach I should consider for this problem. Don't give away the solution.",
        approach: "What's a good general approach to solve this type of problem? Help me think through the strategy.",
        pattern: "What algorithmic pattern or data structure would be most useful here?",
        complexity: "Help me understand the time and space complexity considerations for this problem."
    };

    await this.sendAIMessage(prompts[action]);
}

// NEW CODE - With this:
async handleQuickAction(action) {
    const prompts = {
        hint: `Give me a subtle hint for "${this.currentProblem?.title}". Don't give the solution, just guide my thinking with a leading question or small insight.`,
        
        approach: `Help me understand the best approach for "${this.currentProblem?.title}". Explain the strategy without giving code. What should I think about first?`,
        
        pattern: `What algorithmic pattern does "${this.currentProblem?.title}" follow? Help me recognize the type of problem this is and what techniques typically work for this pattern.`,
        
        walkthrough: `Give me a step-by-step walkthrough for "${this.currentProblem?.title}". Break down the solution process into clear steps, but don't write the actual code. Help me understand the logical flow.`,
        
        pseudocode: `Help me write pseudocode for "${this.currentProblem?.title}". Guide me through the logical structure without giving actual code syntax. What are the main steps in plain English?`,
        
        debug: `I'm having trouble with my approach to "${this.currentProblem?.title}". Ask me questions about my current thinking to help me identify what might be wrong or missing.`
    };

    await this.sendAIMessage(prompts[action]);
}

    async sendAIMessage(userMessage) {
        if (!this.apiKey) {
            this.addChatMessage("Please set your Gemini API key in the extension popup!", 'mentor');
            return;
        }

        const chatContainer = document.getElementById('mentor-chat');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'mentor-message loading';
        loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        chatContainer.appendChild(loadingDiv);

        try {
            const context = this.buildContext(userMessage);
            const response = await this.callGeminiAPI(context);
            
            chatContainer.removeChild(loadingDiv);
            this.addChatMessage(response, 'mentor');
        } catch (error) {
            chatContainer.removeChild(loadingDiv);
            this.addChatMessage("Sorry, I couldn't process your request. Please check your API key.", 'mentor');
        }
    }

    buildContext(userMessage) {
        const systemPrompt = `You are a helpful coding mentor for LeetCode problems. Your role is to:

1. Guide students step-by-step without giving direct solutions
2. Ask probing questions to help them think
3. Explain concepts and patterns
4. Provide hints that lead to insights
5. Encourage problem-solving thinking

Current Problem: ${this.currentProblem?.title || 'Unknown'}
Difficulty: ${this.currentProblem?.difficulty || 'Unknown'}

IMPORTANT: Never provide complete code solutions. Instead, guide the student to discover the solution themselves through hints, questions, and explanations of concepts.`;

        return `${systemPrompt}\n\nStudent Question: ${userMessage}`;
    }

    async callGeminiAPI(prompt) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(`API call failed: ${response.status}`);
        }
    
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from Gemini API');
        }
        
        return data.candidates[0].content.parts[0].text;
    }

    addChatMessage(message, sender) {
        const chatContainer = document.getElementById('mentor-chat');
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'mentor-message';
        messageDiv.textContent = message;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (url.includes('/problems/')) {
                    setTimeout(() => this.analyzeProblem(), 1000);
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }
}

// Initialize the mentor when the script loads
new LeetCodeMentor();