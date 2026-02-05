import re

# Psychological Triggers
URGENCY_KEYWORDS = [
    r"act now", r"immediate action", r"limited time", r"expires in", r"seconds left",
    r"don't wait", r"offer ends", r"urgent", r"rush", r"last chance"
]

FEAR_KEYWORDS = [
    r"account blocked", r"suspended", r"legal action", r"warrant", r"arrest",
    r"infected", r"virus detected", r"security alert", r"hacked", r"breach",
    r"compromised", r"risk of data loss"
]

AUTHORITY_KEYWORDS = [
    r"irs", r"fbi", r"police", r"government", r"department of justice",
    r"microsoft support", r"apple support", r"bank of america", r"official notice",
    r"law enforcement", r"federal reserve"
]

FORCED_ACTION_KEYWORDS = [
    r"call immediately", r"click here to verify", r"verify your identity",
    r"install now", r"download to fix", r"contact support", r"do not close this window"
]

FINANCIAL_THREAT_KEYWORDS = [
    r"funds frozen", r"penalty", r"fine", r"tax due", r"unpaid invoice",
    r"card charged", r"suspicious transaction", r"money laundering"
]

def get_compiled_patterns(keywords):
    return [re.compile(p, re.IGNORECASE) for p in keywords]
