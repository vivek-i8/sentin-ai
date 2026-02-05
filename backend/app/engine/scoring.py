def calculate_risk_score(psych_score, url_reputation_score, tech_score):
    # Weighted average:
    # Psychological: 70% (Increased from 60 to give text more power)
    # URL Reputation: 10% (Reduced)
    # Technical (Scareware/Downloads): 20% (Increased)
    
    final_score = (psych_score * 0.7) + (url_reputation_score * 0.1) + (tech_score * 0.2)
    return min(int(final_score), 100)

def determine_risk_level(score):
    if score >= 55: # Lowered threshold slightly for High
        return "high"
    elif score >= 25:
        return "medium"
    return "low"

def calculate_psych_score(matched_categories):
    # Logic: More categories matched = higher score
    # Base per category: 20
    # Additional weight for specific high-risk categories like Fear or Financial Threat
    
    score = 0
    weights = {
        "urgency": 20, # Bumped +5
        "fear": 30, # Bumped +5
        "authority": 25, # Bumped +5
        "forced_action": 20, # Bumped +5
        "financial_threat": 30 # Bumped +5
    }
    
    for category in matched_categories:
        score += weights.get(category, 10)
        
    return min(score, 100)

def calculate_consent_risk_level(matched_clauses):
    count = len(matched_clauses)
    if count >= 3:
        return "high"
    elif count >= 1:
        return "medium"
    return "low"

def check_url_reputation(domain: str) -> int:
    """
    Mock URL reputation check.
    Returns a score 0-100 (0 = safe, 100 = malicious).
    """
    if not domain:
        return 0
        
    suspicious_domains = ["suspicious", "verify-bank", "account-update", "secure-login-attempt"]
    
    for susp in suspicious_domains:
        if susp in domain:
            return 100
            
    return 0
