# Two-Layer Film Production Prediction System

## Overview

The AI Command Center now implements a sophisticated two-layer prediction architecture that combines machine learning insights with statistical reasoning to deliver transparent, explainable movie success predictions.

---

## Architecture

### Layer 1: AI Prediction (Primary Source of Truth)

**Source:** ML model output from `/api/ai/predict.py`

**Fields:**
- `success_probability` — Base probability derived from historical data patterns (0-100%)
- `prediction` — Classification: "Successful" or "Unsuccessful"
- `suggestedActors` — AI-recommended cast members
- `suggestedDirectors` — AI-recommended directors

**Role:** Serves as the baseline prediction, treating learned patterns as the primary source of truth.

### Layer 2: Statistical Adjustment (Refined Reality Check)

**Source:** Production parameters from user input

**Parameters Evaluated:**
| Parameter | Reference | Weight | Impact |
|-----------|-----------|--------|--------|
| Budget | $150M | 20% | Equipment, crew, marketing |
| Crew Size | 150 | 15% | Operational excellence |
| Cast Size | 20 actors | 12% | Ensemble strength |
| Director Experience | Veteran+ | 18% | Creative execution |
| Shooting Days | 120 days | 12% | Production polish |
| Locations | 6+ sites | 10% | Visual diversity |
| Actor Popularity | A-list (80+) | 13% | Audience appeal |

**Normalization:** All parameters normalized to 0-1 scale relative to industry benchmarks.

**Combined Score Calculation:**
```
Statistical Score = Σ(normalized_factor × weight)
Range: 0 (weak) to 1 (excellent)
```

---

## Adjustment Logic

### Decision Framework

#### High AI Confidence (>75%)
- **Strategy:** Limit upward boost; allow modest downward adjustment
- **Weak Stats:** -8% adjustment (caution flag)
- **Below Average:** -5% adjustment
- **Otherwise:** No adjustment (trust the AI)

#### Low AI Confidence (<40%)
- **Strategy:** Avoid inflating with optimistic stats; respect the baseline
- **Excellent Stats:** +6% adjustment (cautious boost)
- **Above Average:** +3% adjustment
- **Otherwise:** No adjustment

#### Medium Range (40-75%)
- **Strategy:** Proportional adjustment based on parameter strength
- **Formula:** `adjustment = (statistical_score - 0.55) × 20`
- **Capped:** Within ±15% of original probability
- **Reasoning:** Deviation > 0.03 triggers explanatory text

### Adjustment Boundaries

| Magnitude | Reasoning Threshold | Use Case |
|-----------|-------------------|----------|
| -15% to -8% | Weak production design conflicts with strong AI | High-risk venture |
| -8% to -3% | Below-average parameters temper optimistic AI | Moderate caution |
| -3% to +3% | Alignment between AI and stats | High confidence |
| +3% to +8% | Strong parameters support positive AI signal | Moderate boost |
| +8% to +15% | Exceptional parameters overcome weak AI baseline | Opportunity detection |

---

## Output Fields

### Layer 1: AI Insight
```typescript
originalProbability: number     // AI model output (0-100)
aiPrediction: string            // "Successful" | "Unsuccessful"
aiConfidence: number            // Confidence score
```

### Layer 2: Statistical Adjustment
```typescript
adjustmentPercent: number        // ±15% max
adjustmentReasoning: string      // Clear explanation
statisticalScore: number         // 0-100 combined parameter score
```

### Final Output
```typescript
finalProbability: number         // After adjustment
rating: string                   // X.X / 10
riskLevel: "low" | "medium" | "high"
confidenceLevel: "High" | "Medium" | "Lower"
```

### Display Enhancements
```typescript
tags: string[]                   // "Award Potential", "Wide Release", "Low Risk"
trendData: number[]              // 12-month market projection
tips: string[]                   // 3-5 actionable improvements
```

---

## Risk Level Calculation

```
>75% probability → LOW RISK
55-75% probability → MEDIUM RISK  
<55% probability → HIGH RISK
```

---

## Confidence Level Assessment

Based on adjustment magnitude (how far from AI baseline):

| Adjustment | Level | Interpretation |
|-----------|-------|-----------------|
| <5% | High | AI baseline aligns with production reality |
| 5-12% | Medium | Moderate adjustment for parameter variance |
| >12% | Lower | Significant parameter divergence (rare) |

---

## Actionable Improvement Tips

Dynamic generation (3-5 tips) based on underperforming parameters:

| Trigger | Recommendation | Minimum Target |
|---------|-----------------|-----------------|
| Budget <60% | Increase budget | $90M+ |
| Director Inexperienced + Low Prob | Hire veteran/legend | Veteran+ level |
| Crew <70% | Scale operations | 100+ crew |
| Shooting <60% | Extend schedule | 90+ days |
| Actor Popularity <65% + Low Prob | Cast A-list | 70+ popularity |
| Locations <70% + Low Prob | Add diverse sites | 4+ locations |

**Fallback:** If all parameters optimized, provide encouragement message.

---

## Transparency Principles

### 1. Clear Separation
UI displays both AI Insight and Statistical Adjustment visually distinct:
- **AI Insight Box:** Shows original model confidence
- **Statistical Adjust Box:** Shows parameter-based adjustment (+/-)
- **Reasoning Section:** Explains why adjustment was (or wasn't) applied

### 2. Never Hide the Baseline
- Original AI prediction always visible
- Adjustment is shown as a delta, not a replacement
- Users understand the "before" and "after"

### 3. Explainability
- Every adjustment >3% has reasoning text
- Reasoning uses industry-relevant language
- No "black box" probability changes

### 4. Conservative Approach
- Respect high-confidence AI (don't override drastically)
- Don't inflate weak predictions unrealistically
- Adjustments always justified by statistical logic

---

## Example Scenarios

### Scenario 1: Strong AI, Weak Parameters
```
AI Prediction: 82% success
Budget: $50M (33% of $150M benchmark)
Crew: 60 (40% of 150 benchmark)
Combined Statistical Score: 0.45/1.0

Adjustment: -5%
Final: 77% success
Risk Level: MEDIUM (downward adjustment)
Reasoning: "Solid AI prediction tempered by below-average parameters"
```

### Scenario 2: Weak AI, Strong Parameters
```
AI Prediction: 35% success
Budget: $120M (80%)
Crew: 140 (93%)
Director: Legend level
Combined Statistical Score: 0.82/1.0

Adjustment: +6%
Final: 41% success
Risk Level: HIGH
Reasoning: "Weak AI prediction offset by excellent production parameters"
Confidence: Medium (strong boost applied, but respecting baseline)
```

### Scenario 3: Perfect Alignment
```
AI Prediction: 68% success
All parameters: ~55% of combined weighting
Combined Statistical Score: 0.56/1.0

Adjustment: +1%
Final: 69% success
Risk Level: MEDIUM
Reasoning: "AI prediction aligns well with production parameters"
Confidence: High (minimal adjustment)
```

---

## Implementation Details

### File Location
- **Component:** `src/pages/AICommandCenter.tsx`
- **Function:** `getAdjustedSuccess()` (lines ~545-735)

### Key Functions

#### `getAdjustedSuccess()`
Implements the complete two-layer system:
1. Normalizes all production parameters
2. Calculates weighted combined score
3. Determines adjustment magnitude & reasoning
4. Returns complete prediction object with all transparency fields

#### `SuccessBlock()` (UI Component)
Displays:
- AI Insight vs Statistical Adjustment side-by-side
- Adjustment reasoning in highlighted box
- Final probability with risk/confidence metrics
- Actionable improvement tips

### Data Flow

```
API Response (result)
    ↓
getAdjustedSuccess()
    ├─ Normalize parameters
    ├─ Calculate statistical score
    ├─ Determine adjustment (±15% cap)
    └─ Generate recommendations
    ↓
Display Object
    ├─ successPrediction (with all transparency fields)
    ├─ budgetOverrun analysis
    ├─ actorRecommendations
    ├─ crewRecommendations
    └─ releaseWindow
    ↓
SuccessBlock Component (renders transparency layers)
```

---

## Maintenance & Updates

### Adjusting Weights
Parameters weights are hardcoded in `getAdjustedSuccess()` (lines ~560):
```typescript
const weights = {
  budget: 0.20,
  crew: 0.15,
  cast: 0.12,
  director: 0.18,
  shooting: 0.12,
  locations: 0.10,
  actorPopularity: 0.13,
};
```

Sum must equal 1.0. Update based on industry insights.

### Benchmarks
Reference values for normalization (lines ~550-560):
- Budget: $150M (adjust if industry median changes)
- Crew: 150 personnel
- Shooting: 120 days
- Locations: 6 sites
- Cast: 20 actors
- Director: Veteran+ level
- Actor Popularity: 100-point scale

### Tip Generation
Review triggers in `getAdjustedSuccess()` tips generation section (lines ~630+).
Update thresholds as:
- Industry standards evolve
- Historical data improves
- Production cost inflation occurs

---

## Performance Notes

- No blocking operations
- All calculations synchronous (< 1ms)
- Suitable for real-time UI updates
- Result object cached in React state

---

## Future Enhancements

1. **Predictive Confidence Intervals:** ±5% probability range based on historical variance
2. **Genre-Specific Adjustments:** Different parameter weights for Drama vs Action vs Comedy
3. **Temporal Adjustments:** Market trends by release quarter/year
4. **Comparative Analysis:** "Better than X% of productions with similar budget"
5. **What-If Scenarios:** Simulate parameter changes to see probability impact

---

## Version History

- **v1.0** (March 2026): Initial two-layer system with ±15% adjustment cap, risk/confidence metrics, transparency UI
