from pydantic import BaseModel
from typing import List, Optional, Dict

class RiskAnalysisResult(BaseModel):
    risk_score: int
    risk_level: str  # "low", "medium", "high"
    categories: List[str]
    matched_phrases: List[str]
    explanations: List[str]

class ConsentAnalysisResult(BaseModel):
    consent_risk_level: str  # "low", "medium", "high"
    detected_clauses: List[str]
    plain_language_summary: List[str]

class TechnicalSignals(BaseModel):
    phone_detected: bool
    phone_numbers: List[str]
    fake_download_detected: bool
    url_reputation_flagged: bool

class AggregatedRiskResponse(BaseModel):
    final_risk_score: int
    final_risk_level: str
    sections: Dict
    confidence_note: str

class PageAnalysisRequest(BaseModel):
    domain: str
    visible_text: str
    has_consent_banner: bool = False

class ConsentAnalysisRequest(BaseModel):
    consent_text: str
