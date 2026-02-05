// background.js - Service Worker (Classic Script)
importScripts('../rules/fallback_rules.js');

// Helper to get the current tab's domain
async function getCurrentTabDomain() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].url) {
        const url = new URL(tabs[0].url);
        return url.hostname;
    }
    return null;
}


// --- MAIN LISTENER ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyzePage") {
        (async () => { // Use an async IIFE to allow await inside the listener
            const payload = message.data;
            const currentDomain = await getCurrentTabDomain();

            if (currentDomain) {
                const { allowedSites = [] } = await chrome.storage.local.get('allowedSites');
                if (allowedSites.includes(currentDomain)) {
                    console.log(`Domain ${currentDomain} is on allow-list. Skipping analysis.`);
                    const allowedResult = {
                        final_risk_score: 0,
                        final_risk_level: 'allowed',
                        sections: {
                            psychological: {},
                            technical: {},
                            consent: {}
                        },
                        confidence_note: "This site is on your allow-list."
                    };
                    chrome.storage.local.set({ analysisResult: allowedResult }, () => {
                        updateBadge('allowed'); // Update badge to reflect allowed state
                    });
                    return; // Skip further analysis
                }
            }
            
            // Call Backend API
            fetch("http://localhost:8000/analyze/page", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Store result
                    chrome.storage.local.set({ analysisResult: data }, () => {
                        updateBadge(data.final_risk_level);
                    });
                })
                .catch(err => {
                    console.warn("Backend unavailable, using fallback:", err);
                    // Use imported fallback logic
                    const fallbackResult = fallbackAnalyze(payload);
                    chrome.storage.local.set({ analysisResult: fallbackResult }, () => {
                        updateBadge(fallbackResult.final_risk_level);
                    });
                });
        })();
    } else if (message.action === "reAnalyzePage") {
        (async () => {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0) {
                // Execute content script to re-trigger analysis
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['scripts/content.js']
                });
            }
        })();
    }
    return true; // Keep message channel open for async response if needed
});

function updateBadge(riskLevel) {
    let color = "#2ecc71"; // Low - Green
    let text = "";

    // MV3 Badge Logic
    if (riskLevel === "high") {
        color = "#e74c3c"; // Red
        text = "!";
    } else if (riskLevel === "medium") {
        color = "#f1c40f"; // Yellow
        text = "!";
    } else if (riskLevel === "allowed") {
        color = "#007bff"; // Blue for allowed
        text = "OK";
    }

    chrome.action.setBadgeText({ text: text });
    chrome.action.setBadgeBackgroundColor({ color: color });
}
