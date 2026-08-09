import joblib
import pandas as pd
import numpy as np
import os
import sys
import json
from functools import lru_cache

# Local imports
try:
    from utils import get_feature_pipeline, handle_missing_values
except ImportError:
    try:
        from .utils import get_feature_pipeline, handle_missing_values
    except ImportError:
        # Fallback for some environments
        import sys
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        from utils import get_feature_pipeline, handle_missing_values

class MoviePredictor:
    def __init__(self, artifacts_dir):
        self.artifacts_dir = artifacts_dir
        self.load_models()
        self.load_metadata()
    
    def load_models(self):
        """Load ML models and scalers into memory."""
        sys.stderr.write("Initializing MoviePredictor models...\n")
        self.clf = joblib.load(os.path.join(self.artifacts_dir, 'model_clf.pkl'))
        self.reg = joblib.load(os.path.join(self.artifacts_dir, 'model_reg.pkl'))
        self.scaler = joblib.load(os.path.join(self.artifacts_dir, 'scaler.pkl'))
        self.imputer = joblib.load(os.path.join(self.artifacts_dir, 'imputer.pkl'))
        self.le = joblib.load(os.path.join(self.artifacts_dir, 'genre_encoder.pkl'))
        self.feature_stats = joblib.load(os.path.join(self.artifacts_dir, 'feature_stats.pkl'))

    def load_metadata(self):
        """Load auxiliary data like actor recommendations."""
        with open(os.path.join(self.artifacts_dir, 'top_actors_by_genre.json'), 'r') as f:
            self.actor_recs = json.load(f)

    def _calculate_custom_features(self, data):
        """Map user input to model features."""
        feat_dict = {
            'budget_log': np.log1p(data.get('budget', 50000000)),
            'popularity': data.get('popularity', 50),
            'runtime': data.get('runtime', 110),
            'vote_average': data.get('vote_average', 6.5),
            'vote_count': data.get('vote_count', 100),
            'cast_size': data.get('castSize', 15),
            'crew_size': data.get('crewSize', 100),
            'popularity_per_vote': data.get('popularity', 50) / (data.get('vote_count', 100) + 1),
            'actor_popularity_score': data.get('actorPopularity', 70),
            'director_experience_score': self._map_director_exp(data.get('directorExperience', 'mid'))
        }
        return pd.DataFrame([feat_dict])

    def _map_director_exp(self, exp):
        mapping = {"legend": 10.0, "veteran": 7.5, "mid": 5.0, "rookie": 2.5, "none": 1.0}
        if isinstance(exp, (int, float)): return float(exp)
        return mapping.get(str(exp).lower(), 5.0)

    def predict_movie(self, input_data):
        """Full inference pipeline with Layer 2 adjustments."""
        # 1. Base ML Prediction (Layer 1)
        X_df = self._calculate_custom_features(input_data)
        X_imputed = handle_missing_values(X_df, is_train=False, imputer=self.imputer)
        X_scaled = self.scaler.transform(X_imputed)
        
        prob_base = self.clf.predict_proba(X_scaled)[0][1] * 100
        roi_base = self.reg.predict(X_scaled)[0]
        
        # 2. Layer 2: Statistical Adjustments (Moved from Frontend)
        adjusted_data = self._apply_layer2_adjustments(input_data, prob_base)
        
        # 3. Recommendations
        genre = input_data.get('genre', 'Drama')
        actor_recs = self.actor_recs.get(genre, self.actor_recs.get('Drama', []))
        
        return {
            "success_probability": round(adjusted_data['final_prob'], 1),
            "original_probability": round(prob_base, 1),
            "prediction": "Successful" if adjusted_data['final_prob'] >= 55 else "Risky / Flop",
            "confidence": adjusted_data['confidence_level'],
            "risk_percent": round(adjusted_data['risk_percent'], 1),
            "risk_level": adjusted_data['risk_level'],
            "expected_roi": round(float(roi_base), 2),
            "adjustment_percent": round(adjusted_data['adjustment_percent'], 1),
            "adjustment_reasoning": adjusted_data['adjustment_reasoning'],
            "actor_recommendations": actor_recs[:5],
            "crew_recommendations": [f"Lead Director with {input_data.get('directorExperience', 'mid')} experience level"],
            "tips": adjusted_data['tips'],
            "tags": adjusted_data['tags'],
            "rating": round(adjusted_data['final_prob'] / 10, 1),
            "trend_data": [round(adjusted_data['final_prob'] * (0.6 + 0.4 * np.sin(i * 0.7 + 1)), 1) for i in range(12)]
        }

    def _apply_layer2_adjustments(self, data, original_prob):
        """Refined statistical adjustment logic."""
        budget = data.get('budget', 50000000)
        crew_size = data.get('crewSize', 100)
        cast_size = data.get('castSize', 15)
        shooting_days = data.get('shootingDays', 60)
        locations = data.get('locations', 3)
        actor_pop = data.get('actorPopularity', 70)
        dir_exp_label = data.get('directorExperience', 'mid')
        
        # Normalized factors (0-1)
        budget_f = min(budget / 150000000, 1)
        crew_f = min(crew_size / 150, 1)
        cast_f = min(cast_size / 20, 1)
        days_f = min(shooting_days / 120, 1)
        loc_f = min(locations / 6, 1)
        actor_f = actor_pop / 100
        
        dir_exp_f = {"legend": 1.0, "veteran": 0.75, "mid": 0.5}.get(dir_exp_label, 0.25)
        
        # Weighted stats score
        stats_score = (budget_f * 0.2 + crew_f * 0.15 + cast_f * 0.12 + 
                       dir_exp_f * 0.18 + days_f * 0.12 + loc_f * 0.1 + actor_f * 0.13)
        
        # Adjustment magnitude (Capped ±15%)
        adjustment = 0
        reasoning = []
        
        if original_prob > 75:
            if stats_score < 0.5: adjustment = -8; reasoning.append("Weak production parameters temper high AI confidence")
        elif original_prob < 40:
            if stats_score > 0.75: adjustment = 6; reasoning.append("Excellent production parameters boost low AI confidence")
        else:
            deviation = stats_score - 0.55
            adjustment = max(-15, min(15, deviation * 20))
            if adjustment > 3: reasoning.append("Strong production parameters provide positive boost")
            elif adjustment < -3: reasoning.append("Production constraints suggest downward adjustment")
            
        if not reasoning: reasoning.append("Production parameters align with ML model baseline")
        
        final_prob = max(0, min(100, original_prob + adjustment))
        
        # Tips
        tips = []
        if budget < 80000000: tips.append("Increase budget to $80M+ to improve market competitiveness.")
        if dir_exp_f < 0.5: tips.append("Hiring a more experienced director could reduce execution risk.")
        if shooting_days < 75: tips.append("Extend shooting schedule to 75+ days for higher creative quality.")
        
        # Risk assessment
        risk_percent = (1 - final_prob / 100) * 50 + (loc_f * 0.25 + crew_f * 0.25 + days_f * 0.25 + cast_f * 0.25) * 50
        risk_level = "low" if risk_percent < 35 else "medium" if risk_percent < 65 else "high"
        
        return {
            "final_prob": final_prob,
            "adjustment_percent": adjustment,
            "adjustment_reasoning": " · ".join(reasoning),
            "confidence_level": "High" if abs(adjustment) < 5 else "Medium",
            "risk_percent": risk_percent,
            "risk_level": risk_level,
            "tips": tips[:3],
            "tags": ["Award Potential" if final_prob > 80 else "Market Ready" if final_prob > 60 else "Niche Appeal"]
        }

# Global singleton
_predictor = None

def get_predictor():
    global _predictor
    if _predictor is None:
        base_path = os.path.dirname(os.path.abspath(__file__))
        _predictor = MoviePredictor(base_path)
    return _predictor

def predict_movie_success(data):
    """Entry point for all prediction calls."""
    return get_predictor().predict_movie(data)
