export const activeProductions = [
  { id: 1, title: "Eclipse Protocol", genre: "Sci-Fi Thriller", budget: 185000000, spent: 142000000, status: "In Production", progress: 68, director: "Sarah Chen" },
  { id: 2, title: "Midnight Sonata", genre: "Drama", budget: 45000000, spent: 38000000, status: "Post-Production", progress: 85, director: "Marcus Webb" },
  { id: 3, title: "Crimson Horizon", genre: "Action", budget: 220000000, spent: 95000000, status: "Pre-Production", progress: 32, director: "James Okoro" },
  { id: 4, title: "The Last Archive", genre: "Mystery", budget: 62000000, spent: 55000000, status: "In Production", progress: 72, director: "Lena Voss" },
  { id: 5, title: "Quantum Dreams", genre: "Sci-Fi", budget: 150000000, spent: 20000000, status: "Pre-Production", progress: 12, director: "Amir Patel" },
];

export const recentActivity = [
  { id: 1, action: "Budget approved", project: "Eclipse Protocol", time: "2 hours ago", type: "budget" as const },
  { id: 2, action: "New cast member added", project: "Midnight Sonata", time: "4 hours ago", type: "cast" as const },
  { id: 3, action: "Schedule updated", project: "Crimson Horizon", time: "6 hours ago", type: "schedule" as const },
  { id: 4, action: "AI prediction generated", project: "The Last Archive", time: "8 hours ago", type: "ai" as const },
  { id: 5, action: "Crew assignment completed", project: "Quantum Dreams", time: "12 hours ago", type: "crew" as const },
  { id: 6, action: "Location scouting report", project: "Eclipse Protocol", time: "1 day ago", type: "schedule" as const },
];

export const castMembers = [
  { id: 1, name: "Alex Rivera", role: "Lead Actor", projects: 3, rating: 9.2, popularity: 94, available: true },
  { id: 2, name: "Maya Johansson", role: "Lead Actress", projects: 2, rating: 8.8, popularity: 91, available: true },
  { id: 3, name: "David Kim", role: "Supporting Actor", projects: 4, rating: 8.5, popularity: 78, available: false },
  { id: 4, name: "Sofia Rossi", role: "Lead Actress", projects: 1, rating: 9.0, popularity: 88, available: true },
  { id: 5, name: "James Thompson", role: "Supporting Actor", projects: 5, rating: 8.3, popularity: 72, available: true },
  { id: 6, name: "Aria Chen", role: "Lead Actress", projects: 2, rating: 9.1, popularity: 96, available: false },
];

export const crewMembers = [
  { id: 1, name: "Robert Nakamura", role: "Cinematographer", projects: 8, rating: 9.5, experience: "15 years" },
  { id: 2, name: "Elena Petrova", role: "Editor", projects: 12, rating: 9.2, experience: "10 years" },
  { id: 3, name: "Carlos Mendez", role: "Sound Designer", projects: 6, rating: 8.8, experience: "8 years" },
  { id: 4, name: "Lisa Park", role: "Production Designer", projects: 10, rating: 9.0, experience: "12 years" },
  { id: 5, name: "Omar Hassan", role: "VFX Supervisor", projects: 7, rating: 9.3, experience: "11 years" },
  { id: 6, name: "Nina Volkov", role: "Costume Designer", projects: 9, rating: 8.7, experience: "9 years" },
];

export const scheduleEvents = [
  { id: 1, title: "Principal Photography - Eclipse Protocol", start: "Mar 20", end: "Jun 15", status: "active" as const, location: "Vancouver, BC" },
  { id: 2, title: "ADR Sessions - Midnight Sonata", start: "Mar 22", end: "Mar 28", status: "upcoming" as const, location: "Studio A, LA" },
  { id: 3, title: "Location Scout - Crimson Horizon", start: "Mar 25", end: "Apr 5", status: "upcoming" as const, location: "Morocco" },
  { id: 4, title: "VFX Review - The Last Archive", start: "Mar 18", end: "Mar 20", status: "active" as const, location: "Remote" },
  { id: 5, title: "Table Read - Quantum Dreams", start: "Apr 1", end: "Apr 1", status: "upcoming" as const, location: "Studio B, LA" },
  { id: 6, title: "Color Grading - Midnight Sonata", start: "Apr 10", end: "Apr 20", status: "upcoming" as const, location: "Post House, London" },
];

export const budgetData = [
  { category: "Production", allocated: 85000000, spent: 62000000 },
  { category: "Post-Production", allocated: 35000000, spent: 12000000 },
  { category: "Cast & Talent", allocated: 45000000, spent: 40000000 },
  { category: "Crew", allocated: 25000000, spent: 18000000 },
  { category: "Locations", allocated: 15000000, spent: 8000000 },
  { category: "VFX & CGI", allocated: 30000000, spent: 5000000 },
  { category: "Marketing", allocated: 20000000, spent: 2000000 },
];

export const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Thriller", "Horror", "Romance", "Animation", "Documentary"];

export const directorExperience = [
  { label: "Debut Director", value: "debut" },
  { label: "2-5 Films", value: "emerging" },
  { label: "5-10 Films", value: "experienced" },
  { label: "10+ Films (Veteran)", value: "veteran" },
  { label: "Award-Winning", value: "award-winning" },
];

export interface AIPredictionInput {
  title: string;
  genre: string;
  budget: number;
  castSize: number;
  crewSize: number;
  shootingDays: number;
  locations: number;
  directorExperience: string;
  actorPopularity: number;
}

export interface AIPredictionResult {
  budgetOverrun: {
    riskPercent: number;
    status: "low" | "medium" | "high";
    factors: { name: string; impact: number }[];
    insight: string;
  };
  successPrediction: {
    rating: number;
    probability: number;
    tags: string[];
    trendData: number[];
  };
  actorRecommendations: {
    name: string;
    matchPercent: number;
    reason: string;
  }[];
  crewRecommendations: {
    name: string;
    role: string;
    matchPercent: number;
    reason: string;
  }[];
}

export function simulateAIPrediction(input: AIPredictionInput): Promise<AIPredictionResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const budgetFactor = input.budget > 100000000 ? 15 : 5;
      const daysFactor = input.shootingDays > 90 ? 20 : input.shootingDays > 60 ? 10 : 3;
      const locationFactor = input.locations > 5 ? 15 : input.locations > 3 ? 8 : 2;
      const crewFactor = input.crewSize > 200 ? 10 : 3;

      const riskPercent = Math.min(95, budgetFactor + daysFactor + locationFactor + crewFactor + Math.random() * 15);
      const riskStatus: "low" | "medium" | "high" = riskPercent < 30 ? "low" : riskPercent < 60 ? "medium" : "high";

      const baseRating = 5.5;
      const expBonus = input.directorExperience === "award-winning" ? 1.5 : input.directorExperience === "veteran" ? 1.0 : input.directorExperience === "experienced" ? 0.5 : 0;
      const popBonus = input.actorPopularity / 50;
      const rating = Math.min(9.8, baseRating + expBonus + popBonus + Math.random() * 0.8);

      const tags: string[] = [];
      if (input.actorPopularity > 70) tags.push("High Audience Appeal");
      if (input.directorExperience === "award-winning" || input.directorExperience === "veteran") tags.push("Critically Strong");
      if (input.genre === "Horror" || input.genre === "Documentary") tags.push("Niche Genre");
      if (input.budget > 150000000) tags.push("Blockbuster Potential");
      if (input.budget < 30000000) tags.push("Indie Gem");
      if (tags.length === 0) tags.push("Balanced Profile");

      resolve({
        budgetOverrun: {
          riskPercent: Math.round(riskPercent),
          status: riskStatus,
          factors: [
            { name: "Cast Size", impact: Math.round(input.castSize / 5) },
            { name: "Shooting Days", impact: daysFactor },
            { name: "Locations", impact: locationFactor },
            { name: "Crew Complexity", impact: crewFactor },
          ],
          insight: riskStatus === "high"
            ? "Risk elevated due to extended shooting schedule and multiple locations."
            : riskStatus === "medium"
            ? "Moderate risk detected. Consider reducing locations or shooting days."
            : "Project appears well-scoped with manageable risk factors.",
        },
        successPrediction: {
          rating: Math.round(rating * 10) / 10,
          probability: Math.min(95, Math.round((rating / 10) * 100 + Math.random() * 5)),
          tags,
          trendData: Array.from({ length: 12 }, (_, i) => Math.round(40 + Math.random() * 30 + i * 3)),
        },
        actorRecommendations: [
          { name: "Alex Rivera", matchPercent: 94, reason: "Strong box office track record in " + input.genre },
          { name: "Maya Johansson", matchPercent: 89, reason: "Award-winning performance in similar genre" },
          { name: "Sofia Rossi", matchPercent: 85, reason: "Rising star with high audience engagement" },
          { name: "Aria Chen", matchPercent: 82, reason: "Perfect demographic match for target audience" },
        ],
        crewRecommendations: [
          { name: "Robert Nakamura", role: "Cinematographer", matchPercent: 96, reason: "Specialist in " + input.genre + " visual storytelling" },
          { name: "Elena Petrova", role: "Editor", matchPercent: 91, reason: "Proven track record with similar pacing requirements" },
          { name: "Omar Hassan", role: "VFX Supervisor", matchPercent: 88, reason: "Expert in budget-efficient visual effects" },
        ],
      });
    }, 2500);
  });
}
