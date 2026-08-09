import axios, { AxiosInstance, AxiosError } from "axios";

// Always use relative /api path — Vite proxy handles forwarding to :8085 in dev,
// and Vercel routes directly to serverless functions in production.
const API_BASE_URL = "/api";

interface MovieData {
  title: string;
  budget: number;
  runtime: number;
  genre: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  cast_size?: number;
  crew_size?: number;
  shooting_days?: number;
  locations_count?: number;
  director_experience?: number;
  actor_popularity?: number;
  poster?: string;
}

interface PredictionRequest {
  title: string;
  budget: number;
  popularity: number;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genre: string;
}

interface PredictionResponse {
  prediction: string;
  success_probability: number;
  status?: string;
  message?: string;
  suggestedActors?: { name: string; matchPercent: number; reason: string }[];
  suggestedDirectors?: { name: string; matchPercent: number; reason: string }[];
}

export interface MovieResponse {
  _id: string;
  title: string;
  budget: number;
  runtime: number;
  genre: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  poster_url: string;
  prediction: string;
  success_probability: number;
  status: string;
  spent: number;
  progress: number;
  suggestedActors?: string[];
  suggestedDirector?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: { _id: string; name: string };
}

export interface MoviesListResponse {
  success: boolean;
  data: MovieResponse[];
  count: number;
}

class MovieAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add token to requests if it exists
    this.client.interceptors.request.use((config) => {
      const token = this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          this.clearAuthToken();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  private clearAuthToken(): void {
    localStorage.removeItem("authToken");
  }

  /**
   * Predict movie success
   */
  async predictMovie(data: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await this.client.post<PredictionResponse>(
        "/predict",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Prediction error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Create and save a movie with prediction
   */
  async createMovie(
    data: MovieData & { prediction: string; success_probability: number }
  ): Promise<MovieResponse> {
    try {
      const response = await this.client.post<{
        success: boolean;
        data: MovieResponse;
      }>("/movies", data);
      return response.data.data;
    } catch (error) {
      console.error("Create movie error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get all movies
   */
  async getMovies(): Promise<MovieResponse[]> {
    try {
      const response = await this.client.get<MoviesListResponse>("/movies");
      return response.data.data ?? [];
    } catch (error) {
      console.error("Get movies error:", error);
      // Return empty array on 401 (not logged in yet) to avoid dashboard crash
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return [];
      }
      throw this.handleError(error);
    }
  }

  /**
   * Get a single movie by ID
   */
  async getMovie(id: string): Promise<MovieResponse> {
    try {
      const response = await this.client.get<MovieResponse>(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get movie error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete a movie
   */
  async deleteMovie(id: string): Promise<void> {
    try {
      await this.client.delete(`/movies/${id}`);
    } catch (error) {
      console.error("Delete movie error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Update a movie
   */
  async updateMovie(
    id: string,
    data: Partial<MovieData>
  ): Promise<MovieResponse> {
    try {
      const response = await this.client.put<{
        success: boolean;
        data: MovieResponse;
      }>(`/movies/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error("Update movie error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Schedule a movie event
   */
  async scheduleEvent(data: {
    movieTitle: string;
    date: string;
    type: string;
    description?: string;
  }): Promise<any> {
    try {
      const response = await this.client.post("/movies/schedule", data);
      return response.data;
    } catch (error) {
      console.error("Schedule event error:", error);
      throw this.handleError(error);
    }
  }

  async getScheduleEvents(): Promise<any[]> {
    try {
      const response = await this.client.get<{ success: boolean; data: any[] }>("/movies/schedule");
      return response.data.data;
    } catch (error) {
      console.error("Get schedule events error:", error);
      return [];
    }
  }

  /**
   * Get talent (cast or crew)
   */
  async getTalent(type: "cast" | "crew"): Promise<any[]> {
    try {
      const response = await this.client.get<{ success: boolean; data: any[] }>(
        `/talent?type=${type}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Get ${type} error:`, error);
      return [];
    }
  }

  /**
   * Add new talent
   */
  async addTalent(data: any): Promise<any> {
    try {
      const response = await this.client.post("/talent", data);
      return response.data.data;
    } catch (error) {
      console.error("Add talent error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Update talent status (block/unblock)
   */
  async updateTalentStatus(type: "cast" | "crew", id: string, status: "active" | "blocked"): Promise<any> {
    try {
      const response = await this.client.patch("/talent", { type, id, status });
      return response.data.data;
    } catch (error) {
      console.error("Update talent status error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Convert image file to base64
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extract base64 content (remove data:image/...;base64, prefix)
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Handle API errors uniformly
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An error occurred";
      return new Error(message);
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}

// Export a singleton instance
export const movieAPI = new MovieAPI();

export type { MovieData, PredictionRequest, PredictionResponse };
