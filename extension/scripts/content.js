// content.js
// Extracts visible text from the page and communicates with the backend/background.

function getVisibleText() {
    // Clone body to avoid modifying the actual page
    const clone = document.body.cloneNode(true);

    // Remove scripts, styles, noscripts
    const removingSelectors = ['script', 'style', 'noscript', 'iframe', 'svg'];
    removingSelectors.forEach(selector => {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });

    // Get text content and clean up whitespace
    let text = clone.innerText || clone.textContent;
    text = text.replace(/\s+/g, ' ').trim();

    // Limit to 5000 chars as per PRD
    return text.substring(0, 5000);
}

function hasConsentBanner() {
    // Basic heuristic to detect consent banners
    const text = document.body.innerText.toLowerCase();
    const keywords = ["accept cookies", "agree", "privacy policy", "cookie policy", "consent"];
    return keywords.some(k => text.includes(k));
}

// Send data to Background script
chrome.runtime.sendMessage({
    action: "analyzePage",
    data: {
        domain: window.location.hostname,
        visible_text: getVisibleText(),
        has_consent_banner: hasConsentBanner()
    }
});
