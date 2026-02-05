// popup.js

// Helper to get the current tab's domain
async function getCurrentDomain() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tabs[0].url);
    return url.hostname;
}

// Helper to update the displayed list of allowed sites
async function updateAllowedSitesList() {
    const { allowedSites = [] } = await chrome.storage.local.get('allowedSites');
    const allowedSitesList = document.getElementById('allowed-sites-list');
    allowedSitesList.innerHTML = ''; // Clear existing list

    if (allowedSites.length === 0) {
        const li = document.createElement('li');
        li.innerText = 'No sites allowed yet.';
        allowedSitesList.appendChild(li);
    } else {
        allowedSites.forEach(site => {
            const li = document.createElement('li');
            li.innerText = site;
            // Optionally, add a remove button next to each site in the list
            const removeBtn = document.createElement('button');
            removeBtn.innerText = 'X';
            removeBtn.classList.add('remove-single-allow-btn');
            removeBtn.dataset.domain = site;
            removeBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const domainToRemove = e.target.dataset.domain;
                const { allowedSites: currentAllowed } = await chrome.storage.local.get('allowedSites');
                const updatedAllowed = currentAllowed.filter(d => d !== domainToRemove);
                await chrome.storage.local.set({ allowedSites: updatedAllowed });
                updateAllowedSitesList(); // Refresh the list
                // If the current tab's domain was removed, re-analyze
                const currentTabDomain = await getCurrentDomain();
                if (currentTabDomain === domainToRemove) {
                    chrome.runtime.sendMessage({ action: "reAnalyzePage" });
                }
            });
            li.appendChild(removeBtn);
            allowedSitesList.appendChild(li);
        });
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const allowedView = document.getElementById('allowed-view');
    const settingsView = document.getElementById('settings-view');

    const currentDomain = await getCurrentDomain();
    const { allowedSites = [] } = await chrome.storage.local.get('allowedSites');
    
    // Check if the current domain is allowed
    if (allowedSites.includes(currentDomain)) {
        loadingDiv.classList.add('hidden');
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        allowedView.classList.remove('hidden');

        document.getElementById('remove-allow-btn').addEventListener('click', async () => {
            const updatedAllowed = allowedSites.filter(d => d !== currentDomain);
            await chrome.storage.local.set({ allowedSites: updatedAllowed });
            // Optionally, re-trigger analysis for the current page
            chrome.runtime.sendMessage({ action: "reAnalyzePage" });
            window.close(); // Close popup after action
        });
        return; // Exit as we are showing the allowed view
    }


    chrome.storage.local.get(['analysisResult'], (result) => {
        const data = result.analysisResult;

        if (settingsView.classList.contains('hidden')) { // Only process analysis result if settings not open
            if (!data || data.final_risk_level === 'allowed') { // Handle 'allowed' status from background.js
                loadingDiv.classList.add('hidden');
                errorDiv.classList.remove('hidden');
                resultDiv.classList.add('hidden');
                if (data && data.final_risk_level === 'allowed') {
                    allowedView.classList.remove('hidden');
                } else {
                    errorDiv.innerText = "No analysis data found. Try reloading the page.";
                }
                return;
            }

            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');

            // Risk Level UI
            const badge = document.getElementById('risk-badge');
            const levelText = document.getElementById('risk-level-text');
            const scoreText = document.getElementById('risk-score');

            badge.className = `badge risk-${data.final_risk_level}`;
            badge.innerText = data.final_risk_level.toUpperCase();

            levelText.innerText = `Risk Level: ${data.final_risk_level.toUpperCase()}`;
            scoreText.innerText = `Score: ${data.final_risk_score}/100`;

            // Explanations
            const issuesList = document.getElementById('issues-list');
            const psych = data.sections.psychological;

            if (psych && psych.explanations) {
                psych.explanations.forEach(exp => {
                    const li = document.createElement('li');
                    li.innerText = exp;
                    issuesList.appendChild(li);
                });
            }

            const tech = data.sections.technical;
            if (tech) {
                if (tech.phone_detected) {
                    const li = document.createElement('li');
                    li.innerText = "Suspicious phone number detected.";
                    issuesList.appendChild(li);
                }
                if (tech.fake_download_detected) {
                    const li = document.createElement('li');
                    li.innerText = "Potential fake download/scareware.";
                    issuesList.appendChild(li);
                }
                if (tech.url_reputation_flagged) {
                    const li = document.createElement('li');
                    li.innerText = "URL flagged as suspicious.";
                    issuesList.appendChild(li);
                }
            }

            // Consent
            const consent = data.sections.consent;
            const consentSection = document.getElementById('consent-section');
            const consentText = document.getElementById('consent-text');

            if (consent && consent.consent_risk_level !== 'low') {
                consentSection.classList.remove('hidden');
                consentText.innerText = `Risk: ${consent.consent_risk_level}. ${consent.plain_language_summary.join(" ")}`;
            }

            // Confidence Note
            document.getElementById('confidence-note').innerText = data.confidence_note || "";

            // --- Action Buttons ---
            document.getElementById('allow-btn').addEventListener('click', async () => {
                const updatedAllowed = [...allowedSites, currentDomain];
                await chrome.storage.local.set({ allowedSites: updatedAllowed });
                window.close();
            });

            document.getElementById('dismiss-btn').addEventListener('click', () => {
                window.close();
            });
        }
    });

    // --- Manage Button ---
    document.getElementById('manage-btn').addEventListener('click', () => {
        if (settingsView.classList.contains('hidden')) {
            // Show settings
            settingsView.classList.remove('hidden');
            loadingDiv.classList.add('hidden');
            resultDiv.classList.add('hidden');
            errorDiv.classList.add('hidden');
            allowedView.classList.add('hidden');
            updateAllowedSitesList();
        } else {
            // Hide settings, show loading (will be replaced by analysis when re-analyzed)
            settingsView.classList.add('hidden');
            loadingDiv.classList.remove('hidden');
            // Re-trigger analysis if returning from settings to main view
            chrome.runtime.sendMessage({ action: "reAnalyzePage" });
        }
    });

    // --- Reset Allow-list Button ---
    document.getElementById('reset-allow-list-btn').addEventListener('click', async () => {
        await chrome.storage.local.set({ allowedSites: [] });
        updateAllowedSitesList();
        alert('Allow-list has been reset!');
    });
});
