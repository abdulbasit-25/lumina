from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn
import os

# Local import
from predictor import predict_movie_success

app = FastAPI(
    title="Lumina AI Movie Success Predictor",
    description="Production-grade API for predicting movie success and production risks.",
    version="2.1.0"
)

# 1. Data Validation Models
class MovieInput(BaseModel):
    title: Optional[str] = "Untitled Movie"
    budget: float = Field(..., gt=0)
    genre: str = Field(default="Drama")
    runtime: Optional[float] = Field(default=110)
    vote_average: Optional[float] = Field(default=6.5)
    vote_count: Optional[int] = Field(default=100)
    popularity: Optional[float] = Field(default=50.0)
    
    # Frontend specific fields
    castSize: Optional[int] = Field(default=15)
    crewSize: Optional[int] = Field(default=100)
    shootingDays: Optional[int] = Field(default=60)
    locations: Optional[int] = Field(default=3)
    actorPopularity: Optional[float] = Field(default=70.0)
    directorExperience: Optional[str] = Field(default="mid")

class PredictionResponse(BaseModel):
    success_probability: float
    original_probability: float
    prediction: str
    confidence: str
    risk_percent: float
    risk_level: str
    expected_roi: float
    adjustment_percent: float
    adjustment_reasoning: str
    actor_recommendations: List[str]
    crew_recommendations: List[str]
    tips: List[str]
    tags: List[str]
    rating: float
    trend_data: List[float]

# 2. Endpoints
@app.post("/predict", response_model=PredictionResponse)
async def predict(movie: MovieInput):
    try:
        input_data = movie.dict()
        result = predict_movie_success(input_data)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "lumina-ai-predictor", "version": "2.1.0"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting Lumina AI API on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
