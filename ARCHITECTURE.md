# Lumina — Architecture & Working Guide

## Overview
This document explains how Lumina is structured, how components interact, the technology stack, data and deployment schemes, and how to run and extend the system locally.

## Tech Stack
- Frontend: React + TypeScript, Vite, Tailwind CSS
- Backend (web API): TypeScript serverless/Node handlers under `api/` (lightweight HTTP endpoints)
- Machine Learning: Python (training & prediction) located in `TMDB/` and `api/ai/` using standard ML libraries (scikit-learn / PyTorch / TensorFlow as applicable)
- Database: MongoDB (Mongoose types present), connection helpers in `lib/db.ts`
- File storage / media: Cloudinary integration (`lib/cloudinary.ts`)
- Dev tooling: Node/npm, Vite, Playwright for tests, scripts in `scripts/`
- Deployment: Vercel configuration present (`vercel.json`) but adaptable to other platforms

## High-level Component Interaction
- Browser (React app) → Backend API endpoints (`api/`) for domain operations (movies, talent, auth).
- Backend routes forward ML requests to the Python prediction service or call saved model utilities where implemented.
- ML training scripts ingest TMDB data CSVs (`TMDB/`) and output model artifacts into `backend/model/`.
- DB stores domain entities (movies, actors, users, events), seed scripts populate development data.

## Key Modules and Responsibilities
- `src/` — UI components, pages, contexts, service wrappers (`services/movieAPI.ts`).
- `api/` — HTTP endpoints (TypeScript). Examples: `predict.ts`, `movies/*`, `auth/*`.
- `api/ai/` & `TMDB/` — Python training and prediction code. `predict.py` and `predictor.py` implement inference logic.
- `models/` — TypeScript model definitions used by backend and for frontend typing.
- `lib/` & `utils/` — Shared helpers: DB connection, cloudinary, upload middleware.
- `scripts/` — Developer scripts: seeding, test helpers, and local API server runner.

## Data Flow (sequence)
1. User requests a prediction from the UI (AI Command Center or prediction form).
2. Frontend calls `api/predict` with input features.
3. Server validates and routes the request to the Python predictor (either via HTTP to `api/ai/` service or internal binding to saved model utilities).
4. Predictor returns scores/recommendations; server packages results and persists any audit logs if configured.
5. Frontend renders the results and may call follow-up endpoints for saving or scheduling events.

## Database / Schema Summary
- `User`: authentication fields, roles, profile data.
- `Movie`: title, metadata, genres, cast/crew refs.
- `Actor` / `TeamMember`: person details, credits, role tags.
- `ScheduledEvent`: date/time, location, linked movie/production, participants.
Refer to `models/` files for concrete field names and types.

## API Endpoints (examples)
- `POST /api/predict` — Predict movie/talent metrics using model input.
- `GET /api/movies` — List/search movies.
- `POST /api/auth/login` — Authenticate user.
- `POST /api/talent` — Create or update talent records.

## Local Development
1. Node dependencies: `npm install` (workspace root).
2. Frontend dev server: `npm run dev` (uses Vite).
3. Backend API: run via the provided dev script (`scripts/dev-api-server.ts`) or use platform emulation (Vercel dev/other server).
4. Python ML service: create a virtual environment and run training/prediction scripts under `TMDB/` or `api/ai/`:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python TMDB/train_model.py
python api/ai/predict.py --serve
```

Notes:
- Ensure MongoDB is running and configured via environment variables used in `lib/db.ts`.
- Cloudinary credentials (if used) must be set in environment for media uploads.

## Deployment Notes
- The project is set up to deploy to Vercel (see `vercel.json`) — serverless functions map to `api/` handlers.
- ML models can be packaged as separate services (recommended) or embedded as model artifacts called by serverless endpoints — prefer separate service for heavier models.

## Security Considerations
- Protect `api/ai/` prediction endpoints from abuse (rate limiting, auth).
- Store secrets (DB, Cloudinary) in environment/secret manager — never commit to repo.
- Sanitize and validate all file uploads in `middleware/upload.ts`.

## Extensibility & Maintenance
- Model lifecycle: add automated retraining, dataset versioning, and model registry.
- Add tests for backend endpoints and ML reproducibility tests for model outputs.
- Add observability: request tracing, metrics for predictions, and centralized logging.

## Quick File Map
- `src/` — client app
- `api/` — server endpoints
- `api/ai/`, `TMDB/` — ML
- `models/` — domain schemas
- `scripts/` — dev tooling and seeds

## Appendix: Recommended Next Steps
- Add an `API.md` referencing route signatures and request/response examples.
- Create a `DEPLOYMENT.md` with CI steps and platform-specific instructions.
- Add a small docker-compose config to run MongoDB + Python predictor for integration testing.
