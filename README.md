# SentinAI (V1)

SentinAI is a Chrome extension that warns users when a webpage shows common scam patterns such as urgency, fear, or fake authority.

Instead of blocking websites, SentinAI explains *why* a page may be risky so users can make safer decisions.

---

## How It Works

- A **Python (FastAPI) backend** analyzes visible webpage text using rule-based psychological patterns.
- A **Chrome Extension (Manifest V3)** collects page text and displays risk warnings.
- If the backend is unavailable, the extension switches to a **limited offline mode** with basic detection.

---

## Features

- Scam language detection (urgency, fear, authority impersonation)
- Risk scoring with clear explanations (Low / Medium / High)
- Consent & terms risk warnings
- Offline fallback mode
- Domain allow-list (“Allow this site”)

---

## Tech Stack

- Python, FastAPI  
- JavaScript (Chrome Extension – MV3)  
- Regex-based language analysis  
- REST APIs  

---

## Running Locally

See `walkthrough/RUN_GUIDE_WINDOWS.md` for step-by-step instructions.

---

## Project Status

Version 1 focuses on explainable, rule-based detection.  
Future versions may explore ML-assisted scoring while preserving transparency.