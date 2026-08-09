import pandas as pd
import numpy as np
import joblib
import os
import json
import traceback
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error

# Import local utilities
from utils import (
    load_and_merge_data, preprocess_data, get_feature_pipeline, 
    handle_missing_values, save_top_actors
)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, 'TMDB')
MOVIES_CSV = os.path.join(DATA_DIR, 'tmdb_5000_movies.csv')
CREDITS_CSV = os.path.join(DATA_DIR, 'tmdb_5000_credits.csv')
ARTIFACTS_DIR = os.path.dirname(os.path.abspath(__file__))

def train_pipeline():
    try:
        print("Starting Production ML Pipeline...")
        
        # 1. Load Data
        print(f"Loading datasets from {DATA_DIR}...")
        df = load_and_merge_data(MOVIES_CSV, CREDITS_CSV)
        
        # 2. Preprocess
        print("Preprocessing and Feature Engineering...")
        df = preprocess_data(df)
        
        # 3. Save Top Actors for UI Recommendations
        print("Saving actor recommendations...")
        save_top_actors(df, os.path.join(ARTIFACTS_DIR, 'top_actors_by_genre.json'))
        
        # 4. Prepare Features
        features = get_feature_pipeline()
        print(f"Using features: {features}")
        X = df[features]
        y_clf = df['success']
        y_reg = df['roi']
        
        # 5. Encode Categorical
        le = LabelEncoder()
        df['genre_encoded'] = le.fit_transform(df['primary_genre'])
        
        # 6. Handle Missing Values
        print("Handling missing values...")
        X_imputed, imputer = handle_missing_values(X, is_train=True)
        
        # 7. Scale Features
        print("Scaling features...")
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X_imputed)
        
        # 8. Train/Test Split
        X_train, X_test, y_train_clf, y_test_clf = train_test_split(X_scaled, y_clf, test_size=0.2, random_state=42)
        _, _, y_train_reg, y_test_reg = train_test_split(X_scaled, y_reg, test_size=0.2, random_state=42)
        
        # 9. Train Model 1: Classification (Success)
        print("Training Success Classifier (RandomForest)...")
        clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
        clf.fit(X_train, y_train_clf)
        
        # Evaluate Classifier
        clf_score = accuracy_score(y_test_clf, clf.predict(X_test))
        print(f"Classifier Accuracy: {clf_score:.4f}")
        
        # 10. Train Model 2: Regression (ROI)
        print("Training ROI Regressor (RandomForest)...")
        reg = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
        reg.fit(X_train, y_train_reg)
        
        # Evaluate Regressor
        reg_mae = mean_absolute_error(y_test_reg, reg.predict(X_test))
        print(f"Regressor MAE: {reg_mae:.4f}")
        
        # 11. Save Artifacts
        print(f"Saving artifacts to {ARTIFACTS_DIR}...")
        joblib.dump(clf, os.path.join(ARTIFACTS_DIR, 'model_clf.pkl'))
        joblib.dump(reg, os.path.join(ARTIFACTS_DIR, 'model_reg.pkl'))
        joblib.dump(scaler, os.path.join(ARTIFACTS_DIR, 'scaler.pkl'))
        joblib.dump(imputer, os.path.join(ARTIFACTS_DIR, 'imputer.pkl'))
        joblib.dump(le, os.path.join(ARTIFACTS_DIR, 'genre_encoder.pkl'))
        
        # Collect stats
        all_actors = [actor for sublist in df['cast_list'] for actor in sublist]
        actor_counts = pd.Series(all_actors).value_counts().to_dict()
        director_counts = df['director'].value_counts().to_dict()
        
        joblib.dump({
            'actor_counts': actor_counts,
            'director_counts': director_counts
        }, os.path.join(ARTIFACTS_DIR, 'feature_stats.pkl'))
        
        print("Pipeline completed successfully!")
    except Exception as e:
        print(f"FATAL ERROR in pipeline: {str(e)}")
        traceback.print_exc()
        exit(1)

if __name__ == "__main__":
    train_pipeline()
