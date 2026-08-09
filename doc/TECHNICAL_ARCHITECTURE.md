# Technical Architecture - Lumina Studio

## System Overview

Lumina Studio is a **production-ready AI Movie Success Prediction Platform** built with serverless architecture on Vercel.

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER BROWSER                                 │
│  React 18 + TypeScript + TailwindCSS (Single Page Application) │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTPS Request/Response
                             │
┌─────────────────────────────▼────────────────────────────────────┐
│              VERCEL DEPLOYMENT PLATFORM                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  VERCEL EDGE NETWORK (CDN)                                 │ │
│  │  - Static asset caching (images, CSS, JS)                  │ │
│  │  - Geographic distribution                                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                             │                                      │
│  ┌──────────────────────────▼──────────────────────────────────┐  │
│  │  SERVERLESS FUNCTIONS ENVIRONMENT                          │  │
│  │  ┌────────────────────────────────────────────────────┐    │  │
│  │  │ Node.js 20 Runtime Functions                      │    │  │
│  │  │ ├── /api/predict.ts (Main prediction handler)    │    │  │
│  │  │ ├── /api/movies/index.ts (Movie CRUD)            │    │  │
│  │  │ └── /api/[other routes].ts                       │    │  │
│  │  └────────────────────────────────────────────────────┘    │  │
│  │  ┌────────────────────────────────────────────────────┐    │  │
│  │  │ Python 3.12 Runtime Functions                     │    │  │
│  │  │ ├── /api/ai/predict.py (ML prediction service)   │    │  │
│  │  │ └── loads model_success_model.pkl & encoders     │    │  │
│  │  └────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬────────────────────────────────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
        HTTPS API Calls  HTTPS API Calls  HTTPS API Calls
             │               │               │
             ▼               ▼               ▼
┌─────────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  MONGODB ATLAS      │ │  CLOUDINARY  │ │  JWT TOKENS      │
│  ┌───────────────┐  │ │  ┌────────┐  │ │  ┌────────────┐  │
│  │ Lumina        │  │ │  │ Image  │  │ │  │ Generated  │  │
│  │ Database      │  │ │  │ Storage│  │ │  │ & Validated│  │
│  │ Collections:  │  │ │  │        │  │ │  │            │  │
│  │ - movies      │  │ │  │ Secure │  │ │  │ Located in │  │
│  │ - users       │  │ │  │ URLs   │  │ │  │ localStorage   │
│  │ - predictions │  │ │  │        │  │ │  │            │  │
│  └───────────────┘  │ │  └────────┘  │ │  └────────────┘  │
└─────────────────────┘ └──────────────┘ └──────────────────┘
```

---

## Data Flow Architecture

### Flow 1: Movie Prediction

```
User Input (Movie Details)
        │
        ▼
┌─────────────────────────────────────┐
│ React Component                     │
│ MoviePredictionForm                 │
│ - Collects form data                │
│ - Validates input                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ movieAPI Service                    │
│ .predictMovie({...})                │
│ - Constructs request                │
│ - Adds JWT token                    │
│ - Sends POST to /api/predict        │
└────────────┬────────────────────────┘
             │
     HTTP POST Request
     ┌───────────────────────────────┐
     │ {                             │
     │   "budget": 250000000,        │
     │   "popularity": 85.5,         │
     │   "runtime": 148,             │
     │   "vote_average": 8.2,        │
     │   "vote_count": 15000,        │
     │   "genre": "Action"           │
     │ }                             │
     └──────────────┬────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Vercel Serverless Function           │
│ /api/predict.ts (Node.js)            │
│                                      │
│ 1. Verify JWT token                  │
│ 2. Validate input parameters         │
│ 3. Spawn Python process              │
│ 4. Pass data to /api/ai/predict.py  │
│ 5. Parse response                    │
│ 6. Return result to client           │
└──────────┬───────────────────────────┘
           │
    JSON over stdin
    ┌──────────────────┐
    │ {"budget": ...}  │
    └────────┬─────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Python Function                      │
│ /api/ai/predict.py                   │
│                                      │
│ 1. Load model from TMDB/            │
│    └─ movie_success_model.pkl       │
│ 2. Load genre encoder                │
│    └─ genre_encoder.pkl              │
│ 3. Extract features from input       │
│ 4. Encode genre                      │
│ 5. Prepare feature array             │
│ 6. Run model.predict_proba()         │
│ 7. Calculate success probability     │
│ 8. Return JSON response              │
└──────────┬───────────────────────────┘
           │
    JSON over stdout
    ┌─────────────────────────┐
    │ {                       │
    │   "prediction": "...",  │
    │   "success_probability" │
    │ }                       │
    └────────┬────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Response sent to client              │
│ React component updates UI           │
│ Display prediction result            │
└──────────────────────────────────────┘
```

### Flow 2: Save Movie with Prediction

```
User Clicks "Save Movie"
        │
        ▼
┌──────────────────────────────────┐
│ MoviePredictionForm              │
│                                  │
│ 1. Encode poster image to base64 │
│ 2. Collect all form data         │
│ 3. Combine with prediction       │
│ 4. Call movieAPI.createMovie()   │
└─────────────┬────────────────────┘
              │
      HTTP POST Request to /api/movies
      ┌──────────────────────────────┐
      │ {                            │
      │   "title": "Avatar",         │
      │   "budget": 350000000,       │
      │   "runtime": 192,            │
      │   "genre": "Action",         │
      │   "popularity": 95.0,        │
      │   "vote_average": 7.8,       │
      │   "vote_count": 28000,       │
      │   "prediction": "Successful",│
      │   "success_probability": 92.1│
      │   "poster": "BASE64_STRING"  │
      │ }                            │
      └────────┬─────────────────────┘
              │
              ▼
┌──────────────────────────────────────┐
│ Vercel Function /api/movies/index.ts │
│ (Node.js)                            │
│                                      │
│ 1. Verify JWT token                  │
│ 2. Validate all required fields      │
│ 3. If poster exists:                 │
│    ├─ Decode base64                  │
│    ├─ Upload to Cloudinary          │
│    └─ Get secure URL                │
│ 4. Create MongoDB document           │
│ 5. Save to database                  │
│ 6. Return saved movie object         │
└──────────┬───────────────────────────┘
           │
         Upload Image
           │
    ┌──────▼───────┐
    │              │
    ▼              ▼
┌────────────┐ ┌───────────────────┐
│ Cloudinary │ │ MongoDB Atlas     │
│            │ │                   │
│ Receives   │ │ Saves Document:   │
│ Base64     │ │ ┌───────────────┐ │
│ ↓          │ │ │ _id: ObjectId │ │
│ Processes  │ │ │ title: "..."  │ │
│ Image      │ │ │ budget: 350M  │ │
│ ↓          │ │ │ poster_url: .. │ │
│ Returns    │ │ │ prediction: .. │ │
│ URL        │ │ │ createdAt: ... │ │
│            │ │ └───────────────┘ │
└────┬───────┘ └─────────┬─────────┘
     │                   │
     └───────┬───────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Response to Client                   │
│ ┌────────────────────────────────┐   │
│ │ {                              │   │
│ │   "success": true,             │   │
│ │   "message": "Movie saved...",  │   │
│ │   "data": {                    │   │
│ │     "_id": "...",              │   │
│ │     "title": "Avatar",         │   │
│ │     "poster_url": "https://...",│   │
│ │     ...                        │   │
│ │   }                            │   │
│ │ }                              │   │
│ └────────────────────────────────┘   │
│ React updates dashboard              │
│ with new movie card                  │
└──────────────────────────────────────┘
```

### Flow 3: Retrieve Saved Movies

```
User Navigates to Dashboard
        │
        ▼
┌──────────────────────────────┐
│ Dashboard Component          │
│                              │
│ useEffect(() => {           │
│   fetch movies on mount     │
│ })                          │
└─────────────┬────────────────┘
              │
      HTTP GET Request
      /api/movies (with JWT token)
              │
              ▼
┌──────────────────────────────────────┐
│ Vercel Function /api/movies/index.ts │
│ (Node.js)                            │
│                                      │
│ 1. Verify JWT token                  │
│ 2. Connect to MongoDB                │
│    └─ Uses cached connection         │
│ 3. Query Movie collection            │
│    ├─ Sort by createdAt (newest)    │
│    └─ Limit 100 results             │
│ 4. Return movies array               │
└──────────┬───────────────────────────┘
           │
    Database Query
           │
           ▼
┌─────────────────────────────┐
│ MongoDB Query Results       │
│ ┌───────────────────────┐   │
│ │ Movie 1               │   │
│ │ Movie 2               │   │
│ │ ...                  │   │
│ │ Movie N               │   │
│ └───────────────────────┘   │
└──────────┬──────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Response to Client (JSON array)      │
│ ┌────────────────────────────────┐   │
│ │ {                              │   │
│ │   "success": true,             │   │
│ │   "data": [{                   │   │
│ │     "_id": "...",              │   │
│ │     "title": "Avatar",         │   │
│ │     "poster_url": "https://..",│   │
│ │     "prediction": "Successful",│   │
│ │     "success_probability": 92.1│   │
│ │   }, ...],                     │   │
│ │   "count": 10                  │   │
│ │ }                              │   │
│ └────────────────────────────────┘   │
│                                      │
│ React renders movie cards            │
│ with predictions and posters         │
└──────────────────────────────────────┘
```

---

## Component Architecture

### Backend Components

#### 1. **Database Layer** (`lib/db.ts`)

```typescript
// Global connection pool pattern
// Avoids creating new connections on each request
global.mongoose = {
  conn: null,
  promise: null
}

// Connection is reused across invocations
await dbConnect() // First call: creates connection
// Second call: returns cached connection
```

**Benefits:**
- Reduces cold starts
- Saves database resources
- Proper connection pooling

#### 2. **Model Layer** (`models/Movie.ts`)

```typescript
// Mongoose schema with validation
MovieSchema = {
  title: String (required),
  budget: Number,
  runtime: Number,
  genre: String,
  popularity: Number,
  vote_average: Number (0-10),
  vote_count: Number,
  poster_url: String,
  prediction: Enum["Successful", "Not Successful"],
  success_probability: Number (0-100),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

#### 3. **Middleware Layer** (`middleware/upload.ts`)

```typescript
// Handles image upload to Cloudinary
handleImageUpload(req)
├─ Extract base64 from request
├─ Convert to Buffer
├─ Upload to Cloudinary
└─ Return secure URL

// Validates image before upload
validateImageUploadRequest(req)
├─ Check image data exists
├─ Verify base64 format
└─ Return validation status
```

#### 4. **Utilities Layer** (`utils/auth.ts`)

```typescript
// JWT token management
generateToken(payload) → token
verifyToken(token) → payload
getTokenFromRequest(req) → token
verifyAuth(req) → authenticated user

// Token format: Bearer {jwttoken}
// Token contains: userId, email, iat, exp
```

#### 5. **External Services** (`lib/cloudinary.ts`)

```typescript
uploadToCloudinary(buffer, fileName)
├─ Configure Cloudinary SDK
├─ Stream upload
├─ Return secure URL
└─ Store in MongoDB as poster_url

deleteFromCloudinary(publicId)
├─ Remove image from Cloudinary
└─ Clean up storage
```

#### 6. **AI Service** (`api/ai/predict.py`)

```python
# Load at startup (cached)
model = pickle.load(movie_success_model.pkl)
encoder = pickle.load(genre_encoder.pkl)

predict_movie_success(data):
├─ Extract features
├─ Encode genre using encoder
├─ Create feature array
├─ Run model.predict_proba()
├─ Calculate probability (0-100)
└─ Return prediction + probability
```

### Frontend Components

#### 1. **API Service Layer** (`src/services/movieAPI.ts`)

```typescript
MovieAPI class
├─ Singleton instance
├─ axios client with interceptors
├─ Methods:
│  ├─ predictMovie() → prediction result
│  ├─ createMovie() → saved movie
│  ├─ getMovies() → movie list
│  ├─ getMovie(id) → single movie
│  ├─ deleteMovie(id) → void
│  └─ updateMovie(id, data) → updated movie
└─ Auto-handles:
   ├─ JWT token attachment
   ├─ Error handling
   └─ Auth redirect on 401
```

#### 2. **MoviePredictionForm** (`src/components/MoviePredictionForm.tsx`)

```typescript
<MoviePredictionForm />
├─ Form inputs (title, budget, runtime, etc.)
├─ File upload for poster
├─ Submit → predict
├─ Show prediction result
├─ Save button → create movie
└─ Toast notifications
```

#### 3. **Context Providers** (`src/contexts/`)

```typescript
AuthContext
├─ User state
├─ Login/logout methods
└─ Token management

ProductionsContext
├─ Movies list
├─ CRUD operations
└─ Caching logic

SearchContext
├─ Search query
├─ Filter logic
└─ Pagination
```

---

## Database Schema

### Movies Collection

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Avatar",
  "budget": 350000000,
  "runtime": 192,
  "genre": "Action",
  "popularity": 95.0,
  "vote_average": 7.8,
  "vote_count": 28000,
  "poster_url": "https://res.cloudinary.com/dmorye4c0/image/upload/...",
  "prediction": "Successful",
  "success_probability": 92.1,
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

### Indexes

```javascript
// Create for query performance
db.movies.createIndex({ "createdAt": -1 })    // Sort by newest
db.movies.createIndex({ "prediction": 1 })    // Filter by result
db.movies.createIndex({ "genre": 1 })         // Filter by genre
db.movies.createIndex({ "success_probability": -1 }) // Sort by probability
```

---

## API Endpoint Specification

### Authentication

All endpoints except POST /auth/login require:

```
Header: Authorization: Bearer {jwt_token}
```

### Endpoints

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| POST | /api/predict | Get prediction | {prediction, success_probability} |
| GET | /api/movies | List all movies | {data: Movie[], count: number} |
| POST | /api/movies | Create movie | {success: true, data: Movie} |
| GET | /api/movies/:id | Get single movie | Movie object |
| PUT | /api/movies/:id | Update movie | {success: true, data: Movie} |
| DELETE | /api/movies/:id | Delete movie | {success: true} |

### Error Responses

```json
// 400 Bad Request
{
  "error": "Bad request",
  "message": "Missing or invalid required fields"
}

// 401 Unauthorized
{
  "error": "Unauthorized",
  "message": "Missing or invalid authentication token"
}

// 500 Internal Server Error
{
  "error": "Internal server error",
  "message": "Error details"
}
```

---

## Performance Considerations

### Connection Pooling

```typescript
// MongoDB connection pooling
global.mongoose = { conn: null, promise: null }
// Reuses connection across invocations
// Reduces overhead from 2-3s to 50-100ms per request
```

### Image Optimization

```
Cloudinary transforms:
https://res.cloudinary.com/dmorye4c0/image/upload/
  w_500,           // Width
  h_500,           // Height
  c_fill,          // Crop mode
  q_auto,          // Auto quality
  f_webp           // WebP format
```

### Caching Strategy

```typescript
// React Query (TanStack Query)
useQuery(['movies'], fetch, {
  staleTime: 5 * 60 * 1000,    // 5 minutes
  cacheTime: 10 * 60 * 1000,   // 10 minutes
  refetchOnWindowFocus: false
})
```

### Function Timeouts

```
Prediction service: < 5 seconds
Database queries: < 1 second
Image upload: < 10 seconds (Vercel limit)
```

---

## Deployment Architecture

### Vercel Configuration

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "MONGO_URI": "@mongo_uri",
    "JWT_SECRET": "@jwt_secret",
    "CLOUDINARY_*": "@cloudinary_*"
  },
  "functions": {
    "api/**/*.ts": { "runtime": "nodejs20.x" },
    "api/ai/*.py": { "runtime": "python3.12" }
  }
}
```

### Build Process

```
1. Install dependencies
   ├─ npm install (Node packages)
   └─ pip install -r requirements.txt (Python packages)

2. Build frontend
   └─ vite build → dist/

3. Bundle serverless functions
   ├─ Compile TypeScript → JavaScript
   └─ Package Python files

4. Deploy to CDN
   ├─ Static files → Edge locations
   └─ Functions → Regional servers

5. Environment setup
   └─ Inject secrets from vault
```

---

## Security Architecture

### JWT Token Flow

```
1. User authenticates → Backend generates JWT
2. JWT stored in localStorage
3. Every request: Authorization: Bearer {JWT}
4. Middleware: verifyAuth(req)
   ├─ Extract token from header
   ├─ Verify signature
   ├─ Check expiration
   └─ Return user payload or 401
5. Expired token → Redirect to login
```

### Data Security

```
Transit Security:
├─ HTTPS (forced by Vercel)
├─ TLS 1.3 encryption
└─ CORS restrictions

Storage Security:
├─ MongoDB: Username/password auth
├─ Credentials: Environment variables
└─ Images: Cloudinary security policies

Code Security:
├─ No hardcoded secrets
├─ Input validation
├─ SQL injection prevention (Mongoose)
└─ CORS enabled for allowed domains
```

---

## Monitoring & Observability

### Logs Structure

```
timestamp | level | function | message | duration
2024-01-15T10:30:00Z | INFO | /api/predict | Prediction successful | 234ms
2024-01-15T10:30:01Z | ERROR | /api/movies | DB connection timeout | 5000ms
```

### Metrics to Track

```
- Request count per endpoint
- Response time percentiles (p50, p95, p99)
- Error rates by status code
- Database query performance
- Python model inference time
- Cloudinary API response time
- JWT validation success rate
```

### Alerting Thresholds

```
- Response time > 2s
- Error rate > 1%
- Cold start time > 5s
- Database latency > 500ms
- Model prediction timeout
```

---

## Scalability Plan

### Current Capacity

```
- Vercel auto-scaling: 0 → unlimited
- MongoDB Atlas auto-scaling: 0.5 → 1024 IOPS
- Cloudinary bandwidth: 1GB/month (free tier)
- Request rate: No limit (serverless)
```

### Future Optimization

```
1. Database indexing optimization
2. Caching layer (Redis)
3. CDN configuration
4. Model optimization
   ├─ Quantization
   ├─ ONNX Runtime
   └─ Hardware acceleration
5. Batch prediction API
6. Webhook notifications
```

---

This architecture supports:
- ✅ Zero-maintenance deployment
- ✅ Automatic scaling
- ✅ Global distribution
- ✅ High availability
- ✅ Security-first design
- ✅ Easy monitoring
- ✅ Cost-effective (pay-per-use)
