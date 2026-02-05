from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PageAnalysisRequest, AggregatedRiskResponse, ConsentAnalysisRequest, ConsentAnalysisResult
from .engine.analyzer import analyze_page_content
from .engine.consent import analyze_consent_text
from .config import APP_TITLE, APP_VERSION

app = FastAPI(title=APP_TITLE, version=APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/test")
def test_endpoint():
    return {"message": "test"}

@app.post("/analyze/page", response_model=AggregatedRiskResponse)
def analyze_page(request: PageAnalysisRequest):
    try:
        return analyze_page_content(request)
    except Exception as e:
        # In production, log error properly
        print(f"Error analyzing page: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/consent", response_model=ConsentAnalysisResult)
def analyze_consent(request: ConsentAnalysisRequest):
    try:
        return analyze_consent_text(request.consent_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entry point for running directly if needed, though uvicorn app.main:app is preferred
if __name__ == "__main__":
    import uvicorn
    from .config import API_HOST, API_PORT
    uvicorn.run(app, host=API_HOST, port=API_PORT)
