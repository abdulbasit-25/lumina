# Lumina — Project Summary

## Introduction
Lumina is a hybrid web application combining a TypeScript React frontend with a TypeScript/Node backend and a Python-based ML component. It provides movie-related features such as movie browsing, scheduling, talent management, and machine-learning powered predictions and recommendations.

## Project Scope

### What is done
- Frontend (React + TypeScript + Vite): UI pages, forms, components, contexts, and client-side routing.
- Backend (TypeScript): API routes for movies, talent, authentication, and prediction endpoints under `api/` and server helpers in `lib/` and `middleware/`.
- ML/AI (Python): Training and prediction code and datasets in `TMDB/` and `api/ai/` with model artifacts stored under `backend/model/`.
- Data models: Mongoose/TypeScript models for `Actor`, `Movie`, `User`, `ScheduledEvent`, and `TeamMember`.
- Utilities & integrations: Cloudinary integration for media, DB helpers, and various scripts for seeding and dev server tasks.

### What is added (recommended / recently added)
- Prediction endpoints and a modular AI command center UI.
- Seed scripts and developer tooling to populate sample data and team members.
- A lightweight scheduling feature for events and productions.

## Features (Module Distribution)
- Frontend (`src/`)
  - Pages: `Movies`, `Cast`, `Crew`, `Dashboard`, `Schedule`, `AICommandCenter`.
  - UI: reusable components, layout system, and tailwind-based styling.
- API (`api/`)
  - `predict.ts`: HTTP endpoint for model predictions.
  - `movies/`, `talent/`: CRUD endpoints for domain data.
  - `auth/`: `login.ts`, `register.ts` for authentication flows.
- ML / AI (`api/ai/`, `TMDB/`)
  - Training scripts: `train_model.py`, `train_model.py` (TMDB folder).
  - Predictor and model utilities: `predictor.py`, `predict.py`, utilities for preprocessing.
  - Datasets: `tmdb_5000_movies.csv` and `tmdb_5000_credits.csv`, plus `top_actors_by_genre.json`.
- Backend helpers (`backend/`, `lib/`, `utils/`)
  - DB helpers, Cloudinary wrapper, upload middleware, and small utility libraries.
- Scripts (`scripts/`)
  - Seed and dev scripts: `seed.ts`, `seed-team.ts`, `dev-api-server.ts`.

## Conclusion (Future Improvement)
- Improve model performance: experiment with larger feature sets, cross-validation, and model ensembling.
- Add CI/CD pipelines and automated tests for both backend and ML code.
- Harden authentication and add RBAC for admin features.
- Add monitoring (metrics and logs) and model versioning for ML lifecycle management.
- Expand documentation: API reference, component library docs, and deployment guides.
