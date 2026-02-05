import re
from ..schemas import ConsentAnalysisResult
from .scoring import calculate_consent_risk_level

# Redefining these here or importing? 
# To follow strict rules, I should probably keep definitions here or import from a rules file if I had one for consent.
# But user said "rules_psychological.py" and "rules_technical.py" specifically. 
# "Consent" wasn't explicitly mentioned to be split, but `consent.py` exists.
# I will define consent patterns here to keep `rules_*.py` focused as requested.

CONSENT_BROAD_SHARING = [
    r"share with third parties", r"share with partners", r"affiliates",
    r"marketing partners", r"share data"
]

CONSENT_VAGUE_PERMISSIONS = [
    r"business purposes", r"improve our services", r"analytics", r"research"
]

CONSENT_FORCED = [
    r"by continuing you agree", r"if you use this site", r"implied consent"
]

CONSENT_INDEFINITE = [
    r"indefinitely", r"forever", r"as long as necessary"
]

def get_compiled_patterns(keywords):
    return [re.compile(p, re.IGNORECASE) for p in keywords]

def analyze_consent_text(text: str) -> ConsentAnalysisResult:
    detected_clauses = []
    plain_summaries = []
    
    patterns_map = {
        "Broad Data Sharing": (CONSENT_BROAD_SHARING, "This site may share your data with unknown third parties."),
        "Vague Permissions": (CONSENT_VAGUE_PERMISSIONS, "Permissions are not clearly defined."),
        "Forced Consent": (CONSENT_FORCED, "You are forced to agree by simply using the site."),
        "Indefinite Retention": (CONSENT_INDEFINITE, "Data may be kept forever.")
    }
    
    for label, (patterns, summary) in patterns_map.items():
        compiled = get_compiled_patterns(patterns)
        for p in compiled:
            if p.search(text):
                detected_clauses.append(label)
                plain_summaries.append(summary)
                break 
                
    risk_level = calculate_consent_risk_level(detected_clauses)
    
    return ConsentAnalysisResult(
        consent_risk_level=risk_level,
        detected_clauses=detected_clauses,
        plain_language_summary=plain_summaries
    )
