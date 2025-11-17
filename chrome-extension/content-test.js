// Simple test content script
console.log('🧪 TEST: Bosser content script loaded');

// Simple message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('🧪 TEST: Message received:', request);
    
    if (request.action === 'getPageInfo') {
        sendResponse({
            success: true,
            data: {
                url: window.location.href,
                title: document.title,
                type: 'test'
            }
        });
    } else if (request.action === 'executeCode') {
        console.log('🧪 TEST: Executing code for step:', request.step);
        
        // Parse the JSON instructions
        let instructions;
        try {
            instructions = JSON.parse(request.code);
        } catch (error) {
            instructions = { action: request.step };
        }
        
        // Handle basic navigation
        if (instructions.action === 'navigate_to_editor') {
            if (!window.location.href.includes('/article/new')) {
                window.location.href = 'https://www.linkedin.com/article/new/';
                sendResponse({ success: true, message: 'Navigating to editor...' });
            } else {
                sendResponse({ success: true, message: 'Already on editor page' });
            }
        } else {
            sendResponse({ success: true, message: `Test mode: ${instructions.action || request.step} simulated` });
        }
    } else {
        sendResponse({ success: false, error: 'Unknown action in test mode' });
    }
    
    return true;
});

console.log('🧪 TEST: Content script ready');