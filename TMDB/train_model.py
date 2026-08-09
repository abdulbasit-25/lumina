import pandas as pd
import numpy as np
import joblib
import ast
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report

def extract_genre(x):
    try:
        genres = ast.literal_eval(x)
        if not genres:
            return "Unknown"
        return genres[0]['name']
    except:
        return "Unknown"

def extract_cast(x):
    try:
        cast = ast.literal_eval(x)
        return [person['name'] for person in cast[:10]] # Take top 10 cast members
    except:
        return []

print("Loading datasets...")
movies_df = pd.read_csv("tmdb_5000_movies.csv")
credits_df = pd.read_csv("tmdb_5000_credits.csv")

# Merge datasets
df = movies_df.merge(credits_df, left_on='id', right_on='movie_id')

# Clean data
df = df.dropna(subset=['budget', 'revenue', 'popularity', 'vote_average', 'vote_count', 'runtime', 'genres'])

# Feature Engineering
print("Feature engineering...")
df['genre'] = df['genres'].apply(extract_genre)
df['profit_ratio'] = df['revenue'] / (df['budget'] + 1)
df['popularity_per_vote'] = df['popularity'] / (df['vote_count'] + 1)
df['budget_log'] = np.log1p(df['budget'])

# Target: Success (Revenue > 1.5 * Budget AND Profit > 0)
# A more realistic success metric
df['success'] = np.where((df['revenue'] > df['budget'] * 1.5) & (df['revenue'] > 0), 1, 0)

# Actor Recommendation System Pre-calculation
print("Processing actor data...")
df['cast_list'] = df['cast'].apply(extract_cast)

successful_movies = df[df['success'] == 1]
actor_data = []

for idx, row in successful_movies.iterrows():
    genre = row['genre']
    rating = row['vote_average']
    for actor in row['cast_list']:
        actor_data.append({
            'name': actor,
            'genre': genre,
            'rating': rating
        })

actor_df = pd.DataFrame(actor_data)
actor_stats = actor_df.groupby(['genre', 'name']).agg({
    'rating': ['mean', 'count']
}).reset_index()

actor_stats.columns = ['genre', 'name', 'avg_rating', 'movie_count']
# Score = (count * 0.4) + (avg_rating * 10 * 0.6) - a simple weighted score
actor_stats['score'] = (actor_stats['movie_count'] * 2) + (actor_stats['avg_rating'] * 10)
actor_stats = actor_stats.sort_values(['genre', 'score'], ascending=[True, False])

# Save top 20 actors per genre for recommendation
top_actors = actor_stats.groupby('genre').head(20).to_dict(orient='records')
with open('top_actors_by_genre.json', 'w') as f:
    json.dump(top_actors, f)

# Encode Genres
genre_encoder = LabelEncoder()
df['genre_encoded'] = genre_encoder.fit_transform(df['genre'])

# Features for model
features = ['budget_log', 'popularity', 'runtime', 'vote_average', 'vote_count', 'genre_encoded', 'popularity_per_vote']
X = df[features]
y = df['success']

# Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Model Training
print("Training Gradient Boosting model...")
model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
model.fit(X_train, y_train)

# Evaluation
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("Classification Report:")
print(classification_report(y_test, y_pred))

# Save artifacts
print("Saving models and artifacts...")
joblib.dump(model, 'movie_success_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(genre_encoder, 'genre_encoder.pkl')

print("Training completed successfully.")
