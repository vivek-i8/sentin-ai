// fallback_rules.js
// Simplified offline detection logic when API is unreachable.
// LIMITATIONS:
// - Only detects basic urgency keywords and phone numbers.
// - NEVER returns "High" risk (max Medium).
// - Always flags as "Limited protection mode".

const FALLBACK_URGENCY = [
    /act now/i, /immediate action/i, /limited time/i, /expires in/i,
    /urgent/i, /rush/i, /last chance/i
];

const FALLBACK_PHONE = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;

const FALLBACK_CONSENT_RISKS = [
    /third parties/i, /partners/i, /affiliates/i, // Broad data sharing
    /for business purposes/i, // Vague permissions
    /by continuing you agree/i // Forced consent
];

function fallbackAnalyzeConsent(text) {
    const detectedClauses = [];
    for (const pattern of FALLBACK_CONSENT_RISKS) {
        if (pattern.test(text)) {
            detectedClauses.push(pattern.source);
        }
    }

    if (detectedClauses.length > 0) {
        return {
            consent_risk_level: "medium",
            detected_clauses: detectedClauses,
            plain_language_summary: ["This page may ask for broad permissions (Offline Mode)."]
        };
    }

    return {
        consent_risk_level: "low",
        detected_clauses: [],
        plain_language_summary: []
    };
}

function fallbackAnalyze(payload) {
    const { visible_text, has_consent_banner } = payload;
    let matchedWords = [];
    let phoneDetected = false;

    // Check Urgency
    for (let pattern of FALLBACK_URGENCY) {
        if (pattern.test(visible_text)) {
            matchedWords.push("Urgency");
            break; // Just one match is enough for fallback
        }
    }

    // Check Phone
    if (FALLBACK_PHONE.test(visible_text)) {
        phoneDetected = true;
    }

    // --- Scoring Logic (Conservative) ---
    let psychScore = 0;
    if (matchedWords.length > 0 || phoneDetected) {
        psychScore = 40; // Fixed score for fallback medium
    }

    // --- Consent Analysis ---
    let consentResult = null;
    if (has_consent_banner) {
        consentResult = fallbackAnalyzeConsent(visible_text);
    }
    
    // --- Final Aggregation ---
    let finalScore = psychScore;
    if (consentResult && consentResult.consent_risk_level === "medium") {
        finalScore = Math.max(finalScore, 45); // Give a slight bump for consent risk
    }

    let finalRiskLevel = "low";
    if (finalScore > 0) {
        finalRiskLevel = "medium";
    }
    
    return {
        final_risk_score: finalScore,
        final_risk_level: finalRiskLevel,
        sections: {
            psychological: {
                risk_score: psychScore,
                risk_level: psychScore > 0 ? "medium" : "low",
                categories: matchedWords,
                matched_phrases: [],
                explanations: psychScore > 0 ? ["Urgency or pressure detected (Offline Mode)"] : []
            },
            technical: {
                phone_detected: phoneDetected,
                phone_numbers: [],
                fake_download_detected: false,
                url_reputation_flagged: false
            },
            consent: consentResult
        },
        confidence_note: "Limited protection mode (Backend unavailable)"
    };
}
