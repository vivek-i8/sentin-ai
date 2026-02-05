import re
from .rules_psychological import (
    URGENCY_KEYWORDS, FEAR_KEYWORDS, AUTHORITY_KEYWORDS,
    FORCED_ACTION_KEYWORDS, FINANCIAL_THREAT_KEYWORDS,
    get_compiled_patterns
)
from .rules_technical import (
    PHONE_REGEX, SUSPICIOUS_DOWNLOAD_EXTENSIONS, SCAREWARE_INDICATORS
)
from .scoring import calculate_psych_score, calculate_risk_score, determine_risk_level, check_url_reputation
from ..schemas import RiskAnalysisResult, TechnicalSignals, AggregatedRiskResponse, PageAnalysisRequest
from .consent import analyze_consent_text

def analyze_page_content(request: PageAnalysisRequest) -> AggregatedRiskResponse:
    text = request.visible_text
    
    # 1. Psychological Analysis
    matched_categories = []
    matched_phrases = []
    explanations = []
    
    categories_map = {
        "urgency": (URGENCY_KEYWORDS, "Urgency detected (e.g., 'Act now')"),
        "fear": (FEAR_KEYWORDS, "Fear tactics detected (e.g., 'Account suspended')"),
        "authority": (AUTHORITY_KEYWORDS, "Authority impersonation detected"),
        "forced_action": (FORCED_ACTION_KEYWORDS, "Forced action commands detected"),
        "financial_threat": (FINANCIAL_THREAT_KEYWORDS, "Financial threats detected")
    }
    
    for cat_key, (keywords, explanation) in categories_map.items():
        compiled = get_compiled_patterns(keywords)
        found_in_category = False
        for p in compiled:
            match = p.search(text)
            if match:
                if not found_in_category:
                    matched_categories.append(cat_key)
                    explanations.append(explanation)
                    found_in_category = True
                matched_phrases.append(match.group(0))
                
    psych_score = calculate_psych_score(matched_categories)
    
    # 2. Technical Signals
    # Phone
    phone_matches_raw = re.findall(PHONE_REGEX, text)
    phone_matches = []
    for m in phone_matches_raw:
        if isinstance(m, tuple):
            # Join non-empty groups to form the full match string
            phone_matches.append("".join([g for g in m if g]))
        else:
            phone_matches.append(m)
            
    phone_detected = len(phone_matches) > 0
    
    # Fake Downloads 
    fake_download_detected = False
    for ext in SUSPICIOUS_DOWNLOAD_EXTENSIONS:
        if re.search(ext, text, re.IGNORECASE):
            fake_download_detected = True
            break
            
    # Scareware
    scareware_detected = False
    for ind in SCAREWARE_INDICATORS:
        if re.search(ind, text, re.IGNORECASE):
            scareware_detected = True
            break
            
    # URL Reputation
    url_reputation_score = check_url_reputation(request.domain)
    url_reputation_flagged = url_reputation_score > 0
         
    tech_score = 0
    if phone_detected: tech_score += 30
    if fake_download_detected: tech_score += 50
    if scareware_detected: tech_score += 20
    tech_score = min(tech_score, 100)
    
    technical_signals = TechnicalSignals(
        phone_detected=phone_detected,
        phone_numbers=phone_matches[:3], 
        fake_download_detected=fake_download_detected,
        url_reputation_flagged=url_reputation_flagged
    )
    
    # 3. Aggregation
    psych_result = RiskAnalysisResult(
        risk_score=psych_score,
        risk_level=determine_risk_level(psych_score),
        categories=matched_categories,
        matched_phrases=matched_phrases,
        explanations=explanations
    )
    
    final_score = calculate_risk_score(psych_score, url_reputation_score, tech_score)
    final_level = determine_risk_level(final_score)
    
    consent_result = None
    if request.has_consent_banner:
        consent_result = analyze_consent_text(text) 
    
    sections = {
        "psychological": psych_result,
        "technical": technical_signals,
        "consent": consent_result
    }
    
    return AggregatedRiskResponse(
        final_risk_score=final_score,
        final_risk_level=final_level,
        sections=sections,
        confidence_note="Rule-based analysis (MVP)"
    )
