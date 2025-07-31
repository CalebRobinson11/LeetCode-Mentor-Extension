document.addEventListener('DOMContentLoaded', async () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveKeyBtn = document.getElementById('saveKey');
    const apiStatus = document.getElementById('apiStatus');

    // Load saved API key
    const result = await chrome.storage.sync.get(['geminiApiKey']);
    if (result.geminiApiKey) {
        apiKeyInput.value = result.geminiApiKey;
        apiStatus.textContent = '✅ API Key saved';
        apiStatus.className = 'api-status success';
    }

    // Save API key
    saveKeyBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            apiStatus.textContent = '❌ Please enter an API key';
            apiStatus.className = 'api-status error';
            return;
        }

        // Show testing status
        apiStatus.textContent = '🔄 Testing API key...';
        apiStatus.className = 'api-status';

        try {
            // Test with the correct model name
            const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: "Hello"
                                }
                            ]
                        }
                    ]
                })
            });

            const responseData = await testResponse.json();
            
            if (testResponse.ok && responseData.candidates) {
                await chrome.storage.sync.set({ geminiApiKey: apiKey });
                apiStatus.textContent = '✅ API Key saved and verified!';
                apiStatus.className = 'api-status success';
            } else {
                console.error('API Response:', responseData);
                apiStatus.textContent = `❌ ${responseData.error?.message || 'Invalid API key'}`;
                apiStatus.className = 'api-status error';
            }
        } catch (error) {
            console.error('Test error:', error);
            apiStatus.textContent = '❌ Failed to verify API key';
            apiStatus.className = 'api-status error';
        }
    });
});