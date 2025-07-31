// Background script for LeetCode Mentor Extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('LeetCode Mentor Extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes('leetcode.com')) {
        chrome.tabs.sendMessage(tab.id, { action: 'toggleMentor' });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getApiKey') {
        chrome.storage.sync.get(['geminiApiKey']).then((result) => {
            sendResponse({ apiKey: result.geminiApiKey });
        });
        return true; // Will respond asynchronously
    }
});

// Create context menu for quick access
chrome.contextMenus.create({
    id: "leetcode-mentor-help",
    title: "Get Coding Help",
    contexts: ["selection"],
    documentUrlPatterns: ["https://leetcode.com/problems/*"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "leetcode-mentor-help") {
        chrome.tabs.sendMessage(tab.id, {
            action: 'helpWithSelection',
            text: info.selectionText
        });
    }
});