import re

# Technical Patterns
PHONE_REGEX = r"(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|(\b\d{3}[\s.-]?\d{4}\b)"

SUSPICIOUS_DOWNLOAD_EXTENSIONS = [
    r"\.exe$", r"\.bat$", r"\.vbs$", r"\.scr$", r"\.apk$"
]

SCAREWARE_INDICATORS = [
    r"scan complete", r"drivers outdated", r"system damaged", r"repair required"
]
