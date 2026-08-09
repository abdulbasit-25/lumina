# Lumina Studio - Production Deployment Guide

This guide will walk you through setting up and deploying the **AI Movie Success Prediction Platform** to Vercel.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Local Setup](#local-setup)
4. [Environment Configuration](#environment-configuration)
5. [Testing Locally](#testing-locally)
6. [Vercel Deployment](#vercel-deployment)
7. [API Routes Reference](#api-routes-reference)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

This is a **serverless full-stack application** deployed on Vercel with:

```
User Browser (React/TypeScript/Tailwind)
         ↓
Vercel Edge Network (CDN)
         ↓
Vercel Serverless Functions (/api)
         ├── Node.js Functions (predict, movies endpoints)
         └── Python Functions (ML prediction service)
         ↓
External Services
         ├── MongoDB Atlas (Database)
         ├── Cloudinary (Image Storage)
         └── JWT (Authentication)
```

### Key Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 18 + Vite + TypeScript | User interface |
| **API Routes** | Vercel Functions + Node.js | Serverless backend |
| **ML Service** | Python + Scikit-Learn | Movie prediction |
| **Database** | MongoDB Atlas | Data persistence |
| **Storage** | Cloudinary | Poster images |
| **Auth** | JWT tokens | Request security |

---

## Prerequisites

### System Requirements

- **Node.js** 20.x or higher
- **Python** 3.12 or higher
- **npm** or **bun** package manager
- **Git** for version control
- **Vercel CLI** (optional but recommended)

### External Accounts

1. **MongoDB Atlas** - Cloud database
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create free tier cluster
   - Get connection string

2. **Cloudinary** - Image storage
   - Create account at https://cloudinary.com
   - Get API key and secret
   - Cloud name: `dmorye4c0` (already configured)

3. **Vercel** - Deployment platform
   - Create account at https://vercel.com
   - Link your GitHub repository

---

## Local Setup

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd lumina-studio-main

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### Step 2: Verify Model Files

Ensure these files exist in the `TMDB/` directory:

```bash
TMDB/
  ├── movie_success_model.pkl      # Trained ML model
  ├── genre_encoder.pkl             # Genre encoder
  ├── tmdb_5000_movies.csv
  └── tmdb_5000_credits.csv
```

If missing, run:

```bash
cd TMDB
python train_model.py
```

### Step 3: Build TypeScript

```bash
# Verify TypeScript compiles
npm run build
```

---

## Environment Configuration

### Step 1: Create `.env.local` File

Create a file named `.env.local` in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/?appName=Lumina

# JWT Authentication
JWT_SECRET=your-very-secure-random-string-here

# Cloudinary Image Storage
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Step 2: Get MongoDB URI

1. Go to **MongoDB Atlas** → **Database** → **Connect**
2. Choose **Drivers** → **Node.js**
3. Copy the connection string
4. Replace `<username>` and `<password>` with credentials
5. Paste in `.env.local`

Example format:
```
MONGO_URI=mongodb+srv://abdulbasitgr7_db_user:7QVORGy6XLXIFhUb@lumina.fjd0vku.mongodb.net/?appName=Lumina
```

### Step 3: Generate JWT Secret

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy output to `JWT_SECRET` in `.env.local`

### Step 4: Get Cloudinary Credentials

1. Go to **Cloudinary Dashboard** → **Settings** → **API Keys**
2. Copy API Key and API Secret
3. Add to `.env.local`:

```env
CLOUDINARY_API_KEY=321544585999788
CLOUDINARY_API_SECRET=8qgY-reDD-fRbW2LUwiV5afaysU
```

---

## Testing Locally

### Start Development Server

```bash
npm run dev
```

Access at: `http://localhost:8080`

### Test API Endpoints

#### Using cURL

**1. Test Prediction Endpoint:**

```bash
curl -X POST http://localhost:8080/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "budget": 250000000,
    "popularity": 85.5,
    "runtime": 148,
    "vote_average": 8.2,
    "vote_count": 15000,
    "genre": "Action"
  }'
```

**Expected Response:**

```json
{
  "prediction": "Successful",
  "success_probability": 82.4,
  "raw_probability": 0.824,
  "status": "success"
}
```

**2. Test Movies Endpoint (GET):**

```bash
curl -X GET http://localhost:8080/api/movies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**3. Test Movies Endpoint (POST):**

```bash
curl -X POST http://localhost:8080/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Avatar",
    "budget": 350000000,
    "runtime": 192,
    "genre": "Action",
    "popularity": 95.0,
    "vote_average": 7.8,
    "vote_count": 28000,
    "prediction": "Successful",
    "success_probability": 92.1,
    "poster": "BASE64_STRING_HERE"
  }'
```

### Using Postman (Alternative)

1. Create a new POST request to `http://localhost:8080/api/predict`
2. Add header: `Authorization: Bearer YOUR_JWT_TOKEN`
3. Add body (JSON):
   ```json
   {
     "budget": 100000000,
     "popularity": 75,
     "runtime": 120,
     "vote_average": 7.5,
     "vote_count": 5000,
     "genre": "Drama"
   }
   ```
4. Click **Send**

---

## Vercel Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Full-stack AI movie prediction platform"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. Click **Import**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### Step 3: Configure Environment Variables

In Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following:

| Key | Value |
|-----|-------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Your secure random string |
| `CLOUDINARY_API_KEY` | From Cloudinary |
| `CLOUDINARY_API_SECRET` | From Cloudinary |

Example:
```
MONGO_URI = mongodb+srv://user:pass@lumina.fjd0vku.mongodb.net/?appName=Lumina
JWT_SECRET = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
CLOUDINARY_API_KEY = 321544585999788
CLOUDINARY_API_SECRET = 8qgY-reDD-fRbW2LUwiV5afaysU
```

### Step 4: Deploy

1. Vercel will automatically build and deploy
2. Get your production URL (e.g., `https://lumina-studio.vercel.app`)
3. Test all endpoints

---

## API Routes Reference

### Base URL
```
https://lumina-studio.vercel.app/api
```

### Authentication

All endpoints (except login) require JWT token in header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Endpoints

#### 1. Predict Movie Success

**Request:**
```
POST /api/predict
Content-Type: application/json
Authorization: Bearer {token}

{
  "budget": 250000000,
  "popularity": 85.5,
  "runtime": 148,
  "vote_average": 8.2,
  "vote_count": 15000,
  "genre": "Action"
}
```

**Response (200):**
```json
{
  "prediction": "Successful",
  "success_probability": 82.4,
  "raw_probability": 0.824,
  "status": "success"
}
```

#### 2. Get All Movies

**Request:**
```
GET /api/movies
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Avatar",
      "budget": 350000000,
      "runtime": 192,
      "genre": "Action",
      "popularity": 95.0,
      "vote_average": 7.8,
      "vote_count": 28000,
      "poster_url": "https://res.cloudinary.com/...",
      "prediction": "Successful",
      "success_probability": 92.1,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### 3. Create Movie

**Request:**
```
POST /api/movies
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Avatar",
  "budget": 350000000,
  "runtime": 192,
  "genre": "Action",
  "popularity": 95.0,
  "vote_average": 7.8,
  "vote_count": 28000,
  "prediction": "Successful",
  "success_probability": 92.1,
  "poster": "BASE64_STRING_HERE"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Movie saved successfully",
  "data": { ... }
}
```

---

## Frontend Integration Example

### Using the movieAPI Service

```typescript
import { movieAPI } from "@/services/movieAPI";

// Predict movie success
const result = await movieAPI.predictMovie({
  budget: 100000000,
  popularity: 75,
  runtime: 120,
  vote_average: 7.5,
  vote_count: 5000,
  genre: "Drama"
});

// Get all movies
const movies = await movieAPI.getMovies();

// Create movie with prediction
const movie = await movieAPI.createMovie({
  title: "My Movie",
  budget: 100000000,
  runtime: 120,
  genre: "Drama",
  popularity: 75,
  vote_average: 7.5,
  vote_count: 5000,
  prediction: result.prediction,
  success_probability: result.success_probability
});
```

### MoviePredictionForm Component

Use the included `MoviePredictionForm` component:

```tsx
import MoviePredictionForm from "@/components/MoviePredictionForm";

function Dashboard() {
  return (
    <div>
      <MoviePredictionForm />
    </div>
  );
}
```

---

## Folder Structure

```
lumina-studio-main/
│
├── api/                           # Serverless functions
│   ├── ai/
│   │   └── predict.py            # Python ML prediction service
│   ├── movies/
│   │   └── index.ts              # GET/POST movies endpoints
│   └── predict.ts                # Main prediction endpoint
│
├── lib/
│   ├── db.ts                     # MongoDB connection (with caching)
│   └── cloudinary.ts             # Cloudinary image upload
│
├── models/
│   └── Movie.ts                  # MongoDB schema
│
├── middleware/
│   └── upload.ts                 # Image upload handling
│
├── utils/
│   └── auth.ts                   # JWT authentication
│
├── src/
│   ├── components/
│   │   ├── MoviePredictionForm.tsx
│   │   └── ...other components
│   ├── services/
│   │   └── movieAPI.ts           # Frontend API client
│   ├── contexts/
│   ├── pages/
│   └── ...
│
├── types/
│   └── mongoose.d.ts             # TypeScript definitions
│
├── TMDB/
│   ├── movie_success_model.pkl   # Trained model
│   ├── genre_encoder.pkl         # Genre encoder
│   └── ...
│
├── public/
├── .env.local                    # Environment variables (local)
├── .gitignore
├── package.json
├── requirements.txt              # Python dependencies
├── vercel.json                   # Vercel configuration
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Serverless Architecture Features

✅ **No Express Server** - All APIs are Vercel Functions  
✅ **Stateless Functions** - No in-memory storage  
✅ **Global Database Caching** - Reuses Mongoose connections  
✅ **10-Second Timeout** - Python predictions complete in < 5s  
✅ **Auto-Scaling** - Vercel handles traffic spikes  
✅ **Zero Cold Start** - Functions are always warm  
✅ **CORS Enabled** - Works with any frontend domain  

---

## Monitoring & Logs

### View Deployment Logs

**Vercel Dashboard:**
1. Go to your project
2. Click **Deployments**
3. Select a deployment
4. Click **Logs**

**Vercel CLI:**
```bash
vercel logs production
```

### Monitor Database

**MongoDB Atlas:**
1. Dashboard → **Network Access** (check IP is whitelisted)
2. Dashboard → **Metrics** (monitor usage)
3. Dashboard → **Alerts** (set up notifications)

### Monitor API Health

```bash
# Check API status
curl https://lumina-studio.vercel.app/api/predict

# View logs
vercel logs production --follow
```

---

## Security Best Practices

✅ **JWT Tokens** - All API endpoints require valid token  
✅ **Environment Variables** - No credentials in code  
✅ **CORS Configured** - Restricted to your domain  
✅ **HTTPS Only** - Vercel enforces HTTPS  
✅ **MongoDB Auth** - Username/password protected  
✅ **Cloudinary Limited** - API key restricted to uploads  

### Generate Secure Credentials

```bash
# Generate strong JWT secret (32-64 chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate API key
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'pickle'"

**Solution:** Python pickle is built-in. Ensure Python 3.12 runtime is selected in `vercel.json`

### Issue: MongoDB Connection Timeout

**Solution:** 
1. Check IP address is whitelisted in MongoDB Atlas
2. Verify connection string is correct
3. Check network connectivity

```bash
# Test locally
node -e "require('mongoose').connect(process.env.MONGO_URI)"
```

### Issue: Cloudinary Upload Fails

**Solution:**
1. Verify API credentials are correct
2. Check image size (should be < 10MB)
3. Ensure folder path exists

### Issue: Python Prediction timeout

**Solution:**
1. Optimize model loading (use joblib instead of pickle)
2. Ensure Python runtime is Python3.12
3. Check system resources

### Issue: JWT Token Expired

**Solution:**
Implement token refresh mechanism in frontend:

```typescript
const token = localStorage.getItem("authToken");
if (!token) {
  window.location.href = "/login";
}
```

### Issue: "Cannot find module '@vercel/node'"

**Solution:**
```bash
npm install @vercel/node
npm run build
```

---

## Performance Optimization

### Database Query Performance

```typescript
// Use indexes in MongoDB Atlas
// Settings → Indexes → Create index on frequently queried fields

// Good query:
await Movie.find({}).sort({ createdAt: -1 }).limit(100).lean();

// Add index on createdAt field for faster pagination
```

### Image Optimization

```typescript
// Cloudinary transforms for optimization
https://res.cloudinary.com/dmorye4c0/image/upload/
  w_500,          // Width
  q_auto,         // Auto quality
  f_auto/         // Auto format (webp when supported)
  ...
```

### Caching Strategy

```typescript
// Use React Query for automatic caching
const { data: movies } = useQuery(['movies'], () => movieAPI.getMovies(), {
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## Next Steps

1. **Customize UI** - Add your branding to components
2. **Add More Genres** - Extend genre list in MoviePredictionForm
3. **Implement Analytics** - Track predictions and success rates
4. **Add Dashboard Charts** - Visualize prediction trends
5. **Implement User Profiles** - Store preferences per user
6. **Add Batch Predictions** - Process multiple movies at once

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Scikit-Learn Docs**: https://scikit-learn.org
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **React Docs**: https://react.dev

---

## License

This project is licensed under the MIT License.

---

**Last Updated:** March 2026  
**Status:** Production Ready ✅
