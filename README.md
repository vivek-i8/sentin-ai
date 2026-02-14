<div align="center">

# 🛡️ SentinAI (V1)
**Explainable language-based scam detection built as a Chrome Extension with a FastAPI backend.**

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-red?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

*Local-first security system. Deterministic scoring. No ML dependency (V1).*

</div>

---

## 🚀 What SentinAI Does

SentinAI analyzes visible webpage text and detects psychological manipulation patterns commonly used in scams — including urgency pressure, fear escalation, authority impersonation, and financial threat language.

Instead of blocking pages blindly, it generates:

- A structured risk score (Low / Medium / High)
- Category-based signal breakdown
- Clear, human-readable explanations

---

## 💡 Why It Matters

Most security tools rely on:

- URL blacklists  
- Domain reputation  
- Malware signatures  

These approaches fail when scams use legitimate domains or purely psychological manipulation.

SentinAI focuses on **language-driven behavioral signals**, exposing manipulation tactics even when infrastructure appears normal.

---

## 🏗 Architecture Overview

SentinAI consists of two primary components:

### 1️⃣ Chrome Extension (Manifest V3)

- Extracts visible page text (≤ 5000 characters)
- Communicates with backend via service worker
- Displays risk score and reasoning
- Supports limited offline fallback mode

### 2️⃣ Python Backend (FastAPI)

backend/app/  
├── main.py  
├── schemas.py  
└── engine/  
&nbsp;&nbsp;&nbsp;&nbsp;├── analyzer.py  
&nbsp;&nbsp;&nbsp;&nbsp;├── rules_psychological.py  
&nbsp;&nbsp;&nbsp;&nbsp;├── rules_technical.py  
&nbsp;&nbsp;&nbsp;&nbsp;├── scoring.py  
&nbsp;&nbsp;&nbsp;&nbsp;└── consent.py  

---

### 📊 Risk Model

| Signal Category        | Weight |
|------------------------|--------|
| Psychological Signals  | 60%    |
| Technical Indicators   | 15%    |
| Reputation Signals     | 25%    |

**Flow:**

Page → Content Script → Background → FastAPI → Scoring Engine → Extension UI

---

## ✨ Key Features

- Detects urgency, fear, authority impersonation, forced action, financial threats
- Weighted multi-signal scoring model
- Explainability-first output (no opaque scoring)
- Consent-risk detection
- Domain allow-list support
- Graceful offline fallback (limited protection mode)

---

## 🛠 Getting Started

### Prerequisites
- Python 3.10+
- Google Chrome

---

### 1️⃣ Start Backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Backend runs at:

http://127.0.0.1:8000

---

### 2️⃣ Load Extension

1. Open chrome://extensions/  
2. Enable **Developer Mode**  
3. Click **Load Unpacked**  
4. Select the `extension/` folder  

---

### 3️⃣ Test

Open any webpage and click the SentinAI extension icon to evaluate the page.

---

## ⚠ Limitations

- English-only detection (V1)
- Static phrase matching (rule-based)
- Local backend required for full scoring
- Not benchmarked against large phishing datasets

---

## 🔮 Future Work

- Hybrid rule + lightweight ML assistance
- Improved contextual signal aggregation
- Multilingual support
- Enhanced calibration and threshold tuning

---

<div align="center">

🧠 **Core Competencies Demonstrated**  
Browser Extension Architecture • Backend API Design • Rule-Based NLP • Risk Modeling • Explainable Systems  

Built & Maintained by Vivek

</div>