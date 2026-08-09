import joblib
import pandas as pd
import numpy as np
import json
import os

# Paths (assuming they are in the same directory or TMDB)
MODEL_PATH = 'movie_success_model.pkl'
SCALER_PATH = 'scaler.pkl'
ENCODER_PATH = 'genre_encoder.pkl'
ACTORS_PATH = 'top_actors_by_genre.json'

# Load artifacts
# We'll load them relative to the script location
base_path = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(base_path, MODEL_PATH))
scaler = joblib.load(os.path.join(base_path, SCALER_PATH))
genre_encoder = joblib.load(os.path.join(base_path, ENCODER_PATH))

with open(os.path.join(base_path, ACTORS_PATH), 'r') as f:
    top_actors_data = json.load(f)

def calculate_risk(input_data):
    """
    Compute budget overrun risk using weighted formula:
    locations -> 20%
    crew size -> 25%
    shooting days -> 35%
    cast size -> 20%
    """
    # Benchmarks for normalization (0-100 scale)
    norms = {
        'locations': 10,      # >10 is high
        'crewSize': 500,     # >500 is high
        'shootingDays': 100,  # >100 is high
        'castSize': 50        # >50 is high
    }
    
    loc_score = min((input_data.get('locations', 1) / norms['locations']) * 100, 100)
    crew_score = min((input_data.get('crewSize', 10) / norms['crewSize']) * 100, 100)
    days_score = min((input_data.get('shootingDays', 30) / norms['shootingDays']) * 100, 100)
    cast_score = min((input_data.get('castSize', 5) / norms['castSize']) * 100, 100)
    
    risk_percent = (loc_score * 0.20) + (crew_score * 0.25) + (days_score * 0.35) + (cast_score * 0.20)
    
    risk_level = "Low"
    if risk_percent > 70:
        risk_level = "High"
    elif risk_percent > 40:
        risk_level = "Medium"
        
    return {
        "risk_percent": round(risk_percent, 1),
        "risk_level": risk_level,
        "factors": {
            "locations": round(loc_score * 0.20, 1),
            "crew": round(crew_score * 0.25, 1),
            "shooting_days": round(days_score * 0.35, 1),
            "cast": round(cast_score * 0.20, 1)
        }
    }

def get_actor_recommendations(genre):
    # Filter actors by genre
    actors = [a for a in top_actors_data if a['genre'] == genre]
    # Return top 5
    return [{"name": a['name'], "score": round(a['score'], 1)} for a in actors[:5]]

def predict_movie_success(input_data: dict) -> dict:
    # 1. Prepare features for model
    try:
        genre_encoded = genre_encoder.transform([input_data.get('genre', 'Unknown')])[0]
    except:
        genre_encoded = genre_encoder.transform(['Unknown'])[0]
        
    budget = input_data.get('budget', 0)
    budget_log = np.log1p(budget)
    popularity = input_data.get('popularity', 50)
    vote_count = input_data.get('vote_count', 100)
    pop_per_vote = popularity / (vote_count + 1)
    
    features = [
        budget_log,
        popularity,
        input_data.get('runtime', 100),
        input_data.get('vote_average', 6.0),
        vote_count,
        genre_encoded,
        pop_per_vote
    ]
    
    # 2. Scale features
    features_scaled = scaler.transform([features])
    
    # 3. Predict
    prob = model.predict_proba(features_scaled)[0][1] * 100
    prediction = "Successful" if prob >= 50 else "Not Successful"
    
    # Confidence Level
    confidence = "High" if (prob > 80 or prob < 20) else "Medium"
    if 40 < prob < 60:
        confidence = "Low"
        
    # 4. Success Score (derived from probability and other factors)
    score = round((prob / 10), 1)
    
    # 5. Risk Assessment
    risk_data = calculate_risk(input_data)
    
    # 6. Actor Recommendations
    recommended_actors = get_actor_recommendations(input_data.get('genre', 'Unknown'))
    
    # 7. Insights & Improvement Tips
    insights = []
    tips = []
    
    if budget < 50000000:
        insights.append("Budget is below industry average for high-impact films.")
        tips.append("Consider increasing budget to match top-performing films in this genre.")
    else:
        insights.append("Healthy budget allocated for production.")
        
    if popularity > 60:
        insights.append("High initial popularity improves success chance significantly.")
    else:
        tips.append("Invest in marketing to boost pre-release popularity.")
        
    if risk_data['risk_percent'] > 50:
        insights.append(f"High production risk due to complexity ({risk_data['risk_level']}).")
        tips.append("Optimize shooting schedule to reduce risk of budget overrun.")

    return {
        "prediction": prediction,
        "success_probability": round(prob, 1),
        "confidence": confidence,
        "score": score,
        "risk": risk_data,
        "insights": insights,
        "improvement_tips": tips,
        "recommended_actors": recommended_actors
    }

# Example usage for testing
if __name__ == "__main__":
    test_input = {
        "budget": 50000000,
        "popularity": 70,
        "runtime": 110,
        "vote_average": 7,
        "vote_count": 1000,
        "genre": "Animation",
        "castSize": 15,
        "crewSize": 100,
        "shootingDays": 60,
        "locations": 3
    }
    result = predict_movie_success(test_input)
    print(json.dumps(result, indent=2))
