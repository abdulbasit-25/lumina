import pandas as pd
import numpy as np
import json
import ast
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer

def load_and_merge_data(movies_path, credits_path):
    """Load and merge TMDB movies and credits datasets."""
    movies = pd.read_csv(movies_path)
    credits = pd.read_csv(credits_path)
    
    # Merge on id (movies) = movie_id (credits)
    df = movies.merge(credits, left_on='id', right_on='movie_id')
    return df

def parse_json_column(x, key='name', limit=None):
    """Parse JSON string columns safely."""
    if not isinstance(x, str) or pd.isna(x):
        return []
    try:
        data = ast.literal_eval(x)
        if not isinstance(data, list):
            return []
        items = [item[key] for item in data if isinstance(item, dict) and key in item]
        if limit:
            return items[:limit]
        return items
    except (ValueError, SyntaxError, TypeError):
        return []

def get_director(crew_json):
    """Extract director name from crew JSON."""
    if not isinstance(crew_json, str) or pd.isna(crew_json):
        return "Unknown"
    try:
        crew = ast.literal_eval(crew_json)
        if not isinstance(crew, list):
            return "Unknown"
        for person in crew:
            if isinstance(person, dict) and person.get('job') == 'Director':
                return person.get('name')
        return "Unknown"
    except (ValueError, SyntaxError, TypeError):
        return "Unknown"

def preprocess_data(df):
    """Main preprocessing pipeline."""
    # 1. Parse JSON columns
    df['genres_list'] = df['genres'].apply(lambda x: parse_json_column(x))
    df['cast_list'] = df['cast'].apply(lambda x: parse_json_column(x))
    df['primary_genre'] = df['genres_list'].apply(lambda x: x[0] if x else "Unknown")
    
    # 2. Extract structured features
    df['cast_size'] = df['cast_list'].apply(len)
    def get_crew_size(x):
        if not isinstance(x, str) or pd.isna(x):
            return 0
        try:
            res = ast.literal_eval(x)
            return len(res) if isinstance(res, list) else 0
        except:
            return 0
            
    df['crew_size'] = df['crew'].apply(get_crew_size)
    df['top_3_actors'] = df['cast_list'].apply(lambda x: x[:3])
    df['director'] = df['crew'].apply(get_director)
    
    # 3. Budget Log Transform
    df['budget_log'] = np.log1p(df['budget'])
    
    # 4. Success Target (revenue > budget * 2)
    # Avoid division by zero
    df['success'] = ((df['revenue'] > df['budget'] * 2) & (df['revenue'] > 0) & (df['budget'] > 0)).astype(int)
    
    # 5. ROI Target
    df['roi'] = df.apply(lambda row: row['revenue'] / row['budget'] if row['budget'] > 0 else 0, axis=1)
    
    # 6. Feature Engineering
    df['popularity_per_vote'] = df['popularity'] / (df['vote_count'] + 1)
    
    # 7. Knowledge-based scores (Actor & Director popularity)
    # We'll compute these based on frequency in THIS dataset
    all_actors = [actor for sublist in df['cast_list'] for actor in sublist]
    actor_counts = pd.Series(all_actors).value_counts().to_dict()
    
    df['actor_popularity_score'] = df['cast_list'].apply(
        lambda x: np.mean([actor_counts.get(a, 0) for a in x]) if x else 0
    )
    
    director_counts = df['director'].value_counts().to_dict()
    df['director_experience_score'] = df['director'].apply(lambda x: director_counts.get(x, 0))
    
    return df

def get_feature_pipeline():
    """Returns columns to keep for the model."""
    return [
        'budget_log', 'popularity', 'runtime', 'vote_average', 
        'vote_count', 'cast_size', 'crew_size', 'popularity_per_vote',
        'actor_popularity_score', 'director_experience_score'
    ]

def handle_missing_values(X, is_train=True, imputer=None):
    """Impute missing values."""
    if is_train:
        imputer = SimpleImputer(strategy='median')
        X_imputed = imputer.fit_transform(X)
        return X_imputed, imputer
    else:
        if imputer is None:
            raise ValueError("Imputer must be provided for inference")
        return imputer.transform(X)

def save_top_actors(df, output_path):
    """Save top actors by genre for recommendations."""
    successful_movies = df[df['success'] == 1]
    
    actor_genre_stats = []
    for _, row in successful_movies.iterrows():
        genre = row['primary_genre']
        for actor in row['top_3_actors']:
            actor_genre_stats.append({'genre': genre, 'actor': actor})
            
    stats_df = pd.DataFrame(actor_genre_stats)
    top_actors = stats_df.groupby(['genre', 'actor']).size().reset_index(name='count')
    top_actors = top_actors.sort_values(['genre', 'count'], ascending=[True, False])
    
    # Save as JSON mapping genre -> [actors]
    result = {}
    for genre in top_actors['genre'].unique():
        result[genre] = top_actors[top_actors['genre'] == genre]['actor'].head(10).tolist()
        
    with open(output_path, 'w') as f:
        json.dump(result, f)
    return result
