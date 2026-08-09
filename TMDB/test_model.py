import joblib
import pandas as pd
import ast
import random

print("Loading datasets...")

movies = pd.read_csv("TMDB/tmdb_5000_movies.csv")
credits = pd.read_csv("TMDB/tmdb_5000_credits.csv")

model = joblib.load("TMDB/movie_success_model.pkl")

print("Preparing sample movie...")

sample = pd.DataFrame([{
    'budget': 100000000,
    'popularity': 80.5,
    'runtime': 120,
    'vote_average': 7.2,
    'vote_count': 1500,
    'genre': 2
}])

prediction = model.predict(sample)
probability = model.predict_proba(sample)

success_probability = probability[0][1] * 100
success_score = (success_probability / 10)

# ---------- Budget Risk ----------
locations = random.randint(10,20)
crew_size = random.randint(8,15)
shooting_days = random.randint(12,25)
cast_size = random.randint(10,18)

risk = (locations + crew_size + shooting_days + cast_size) / 4
risk_percent = round((risk / 40) * 100)

if risk_percent < 30:
    risk_level = "LOW RISK"
elif risk_percent < 60:
    risk_level = "MEDIUM RISK"
else:
    risk_level = "HIGH RISK"


# ---------- Actor Recommendations ----------
print("Finding actors...")

credits['cast'] = credits['cast'].apply(ast.literal_eval)

all_actors = []

for cast_list in credits['cast']:
    for actor in cast_list[:3]:
        all_actors.append(actor['name'])

actor_sample = random.sample(all_actors,3)

# ---------- OUTPUT ----------
print("\n=========== AI PRODUCTION INSIGHTS ===========\n")

print("Budget Overrun Risk")
print(risk_percent,"%")
print(risk_level)

print("\nSuccess Prediction")
print(round(success_score,1),"/10")
print("Success Probability:", round(success_probability,1),"%")

print("\nRecommended Actors")
for actor in actor_sample:
    print("-",actor)

print("\n==============================================")