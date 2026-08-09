import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { movieAPI } from "@/services/movieAPI";
import { useToast } from "@/hooks/use-toast";

// Available genres from the model
const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
];

// Form validation schema
const predictionSchema = z.object({
  title: z.string().min(1, "Movie title is required"),
  genre: z.string().min(1, "Genre is required"),
  budget: z.number().min(1, "Budget must be greater than 0"),
  runtime: z.number().min(1, "Runtime must be greater than 0"),
  popularity: z.number().min(0, "Popularity must be non-negative"),
  vote_average: z.number().min(0).max(10, "Vote average must be between 0 and 10"),
  vote_count: z.number().min(0, "Vote count must be non-negative"),
});

type PredictionForm = z.infer<typeof predictionSchema>;

interface PredictionResult {
  prediction: string;
  success_probability: number;
  status: string;
  message?: string;
}

export default function AICommandCenter() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PredictionForm>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      popularity: 50,
      vote_average: 5,
      vote_count: 100,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: PredictionForm) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const predictionResult = await movieAPI.predictMovie(data);
      setResult(predictionResult);

      // Show success toast
      toast({
        title: "Prediction Complete",
        description: `AI prediction generated for "${data.title}"`,
      });

      // Optionally save to database
      try {
        await movieAPI.createMovie({
          ...data,
          prediction: predictionResult.prediction,
          success_probability: predictionResult.success_probability,
        });

        toast({
          title: "Movie Saved",
          description: "Prediction saved to your movie database",
        });
      } catch (saveError) {
        console.error("Failed to save movie:", saveError);
        toast({
          title: "Prediction Generated",
          description: "Movie prediction completed but not saved",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Prediction failed";
      setError(errorMessage);
      toast({
        title: "Prediction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = (data: PredictionForm, result: PredictionResult) => {
    const insights = [];

    if (data.budget > 100000000) {
      insights.push("High budget increases production quality but raises financial risk");
    } else if (data.budget < 10000000) {
      insights.push("Low budget may limit marketing and star power");
    }

    if (data.popularity > 70) {
      insights.push("High popularity suggests strong audience interest");
    } else if (data.popularity < 30) {
      insights.push("Low popularity may indicate niche appeal");
    }

    if (data.vote_average > 7) {
      insights.push("High pre-vote average indicates quality expectations");
    }

    if (data.vote_count < 50) {
      insights.push("Low vote count reduces prediction confidence");
    }

    if (result.success_probability > 70) {
      insights.push("Strong success indicators - consider greenlighting");
    } else if (result.success_probability < 30) {
      insights.push("High risk factors identified - review budget allocation");
    }

    return insights;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            AI Movie Prediction Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300"
          >
            Leverage machine learning to predict movie success
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Movie Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Movie Title */}
                <div>
                  <Label htmlFor="title" className="text-white">Movie Title</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter movie title"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Genre */}
                <div>
                  <Label htmlFor="genre" className="text-white">Genre</Label>
                  <Select onValueChange={(value) => setValue("genre", value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.genre && (
                    <p className="text-red-400 text-sm mt-1">{errors.genre.message}</p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <Label htmlFor="budget" className="text-white">
                    Budget ($)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    {...register("budget", { valueAsNumber: true })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="1000000"
                  />
                  {errors.budget && (
                    <p className="text-red-400 text-sm mt-1">{errors.budget.message}</p>
                  )}
                </div>

                {/* Runtime */}
                <div>
                  <Label htmlFor="runtime" className="text-white">
                    Runtime (minutes)
                  </Label>
                  <Input
                    id="runtime"
                    type="number"
                    {...register("runtime", { valueAsNumber: true })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="120"
                  />
                  {errors.runtime && (
                    <p className="text-red-400 text-sm mt-1">{errors.runtime.message}</p>
                  )}
                </div>

                {/* Popularity */}
                <div>
                  <Label className="text-white">
                    Popularity: {watchedValues.popularity}
                  </Label>
                  <Slider
                    value={[watchedValues.popularity || 50]}
                    onValueChange={(value) => setValue("popularity", value[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Vote Average */}
                <div>
                  <Label className="text-white">
                    Vote Average: {watchedValues.vote_average?.toFixed(1)}
                  </Label>
                  <Slider
                    value={[watchedValues.vote_average || 5]}
                    onValueChange={(value) => setValue("vote_average", value[0])}
                    max={10}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                {/* Vote Count */}
                <div>
                  <Label htmlFor="vote_count" className="text-white">
                    Vote Count
                  </Label>
                  <Input
                    id="vote_count"
                    type="number"
                    {...register("vote_count", { valueAsNumber: true })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="100"
                  />
                  {errors.vote_count && (
                    <p className="text-red-400 text-sm mt-1">{errors.vote_count.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running AI Prediction...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Run AI Prediction
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-400 mb-4" />
                    <p className="text-slate-300">AI is analyzing your movie parameters...</p>
                  </motion.div>
                )}

                {result && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Prediction Status */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {result.prediction === "Successful" ? (
                          <CheckCircle className="h-8 w-8 text-green-400" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-400" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {result.prediction}
                      </h3>
                      <p className="text-slate-300">AI Prediction Result</p>
                    </div>

                    {/* Success Probability */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${result.success_probability}, 100`}
                            className="text-slate-600"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${result.success_probability}, 100`}
                            className={
                              result.success_probability > 70
                                ? "text-green-400"
                                : result.success_probability > 40
                                ? "text-yellow-400"
                                : "text-red-400"
                            }
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {result.success_probability}%
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-300">Success Probability</p>
                    </div>

                    {/* Insights */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">AI Insights</h4>
                      <div className="space-y-2">
                        {generateInsights(watchedValues, result).map((insight, index) => (
                          <div
                            key={index}
                            className="bg-slate-700/50 rounded-lg p-3 border border-slate-600"
                          >
                            <p className="text-slate-300 text-sm">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {!result && !isLoading && !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Target className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">
                      Fill out the form and run AI prediction to see results
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}