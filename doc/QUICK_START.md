# Quick Start Guide

Get the Lumina Studio AI Movie Prediction Platform running in 5 minutes.

## Prerequisites

- Node.js 20+ 
- Python 3.12+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Git

## 1. Clone & Install

```bash
cd lumina-studio-main
npm install
pip install -r requirements.txt
```

## 2. Create `.env.local`

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Lumina
JWT_SECRET=your-secret-key-here
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Get these:**
- **MongoDB**: https://www.mongodb.com/cloud/atlas → Create cluster → Get connection string
- **Cloudinary**: https://cloudinary.com → Dashboard → Settings → API Keys

## 3. Start Development Server

```bash
npm run dev
```

Open: `http://localhost:8080`

## 4. Test Prediction Endpoint

```bash
curl -X POST http://localhost:8080/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-token" \
  -d '{
    "budget": 100000000,
    "popularity": 75,
    "runtime": 120,
    "vote_average": 7.5,
    "vote_count": 5000,
    "genre": "Drama"
  }'
```

Expected response:
```json
{
  "prediction": "Successful",
  "success_probability": 82.4,
  "status": "success"
}
```

## 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add environment variables in Vercel dashboard → Settings → Environment Variables

## Done! 🎉

You now have a production-ready AI movie prediction platform deployed on Vercel.

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Check code quality
npm run test             # Run tests

# Python
python TMDB/test_model.py      # Test model locally
python TMDB/train_model.py     # Retrain model
```

## Project Structure

```
api/                    # Serverless functions
├── ai/predict.py       # ML prediction
├── movies/index.ts     # CRUD endpoints
└── predict.ts          # Prediction handler

src/                    # React frontend
├── components/         # UI components
├── services/           # API client
├── contexts/           # State management
└── pages/             # Pages

lib/                    # Utilities
├── db.ts              # MongoDB connection
└── cloudinary.ts      # Image upload

models/                 # Mongoose schemas
└── Movie.ts

TMDB/                   # ML models
├── movie_success_model.pkl
└── genre_encoder.pkl
```

## Next Steps

1. ✅ Customize the UI
2. ✅ Add more genres
3. ✅ Build analytics dashboard
4. ✅ Add user profiles
5. ✅ Implement batch predictions

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
See `TECHNICAL_ARCHITECTURE.md` for system design.
