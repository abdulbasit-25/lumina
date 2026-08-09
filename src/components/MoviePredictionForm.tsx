import React, { useState } from "react";
import { movieAPI } from "@/services/movieAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface PredictionResult {
  prediction: string;
  success_probability: number;
}

export function MoviePredictionForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    budget: 0,
    runtime: 0,
    genre: "",
    popularity: 0,
    vote_average: 0,
    vote_count: 0,
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await movieAPI.predictMovie({
        budget: formData.budget,
        popularity: formData.popularity,
        runtime: formData.runtime,
        vote_average: formData.vote_average,
        vote_count: formData.vote_count,
        genre: formData.genre,
      });

      if (result.status === "error") {
        toast({
          title: "Prediction Error",
          description: result.message || "Failed to get prediction",
          variant: "destructive",
        });
      } else {
        setPrediction(result);
        toast({
          title: "Prediction Success",
          description: `Movie predicted: ${result.prediction} (${result.success_probability}%)`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to predict",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMovie = async () => {
    if (!prediction) return;

    setIsLoading(true);
    try {
      let posterBase64: string | undefined;

      if (posterFile) {
        posterBase64 = await movieAPI.fileToBase64(posterFile);
      }

      await movieAPI.createMovie({
        ...formData,
        ...prediction,
        poster: posterBase64,
      });

      toast({
        title: "Success",
        description: "Movie saved successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        budget: 0,
        runtime: 0,
        genre: "",
        popularity: 0,
        vote_average: 0,
        vote_count: 0,
      });
      setPosterFile(null);
      setPrediction(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save movie",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handlePredict} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Movie Success Prediction</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="title">Movie Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter movie title"
              required
            />
          </div>

          <div>
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="runtime">Runtime (minutes)</Label>
            <Input
              id="runtime"
              name="runtime"
              type="number"
              value={formData.runtime}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="genre">Genre</Label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Genre</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
            </select>
          </div>

          <div>
            <Label htmlFor="popularity">Popularity Score</Label>
            <Input
              id="popularity"
              name="popularity"
              type="number"
              step="0.1"
              value={formData.popularity}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="vote_average">Average Rating (0-10)</Label>
            <Input
              id="vote_average"
              name="vote_average"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.vote_average}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="vote_count">Number of Votes</Label>
            <Input
              id="vote_count"
              name="vote_count"
              type="number"
              value={formData.vote_count}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="poster">Movie Poster (Optional)</Label>
            <Input
              id="poster"
              type="file"
              accept="image/*"
              onChange={handlePosterChange}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Predicting...
            </>
          ) : (
            "Get Prediction"
          )}
        </Button>
      </form>

      {prediction && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Prediction Result</h3>
          <div className="space-y-2 mb-4">
            <p className="text-lg">
              <strong>Status:</strong>{" "}
              <span className={prediction.prediction === "Successful" ? "text-green-600" : "text-red-600"}>
                {prediction.prediction}
              </span>
            </p>
            <p className="text-lg">
              <strong>Success Probability:</strong> {prediction.success_probability}%
            </p>
          </div>
          <Button onClick={handleSaveMovie} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Movie"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default MoviePredictionForm;
