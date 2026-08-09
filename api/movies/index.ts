import { VercelRequest, VercelResponse } from "@vercel/node";
import { dbConnect } from "../../lib/db";
import { Movie } from "../../models/Movie";
import { handleImageUpload } from "../../middleware/upload";
import { verifyAuth, sendUnauthorized } from "../../utils/auth";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Verify authentication
  const user = verifyAuth(req);
  if (!user) {
    return sendUnauthorized(res);
  }

  // Connect to database
  await dbConnect();

  if (req.method === "GET") {
    return handleGetMovies(res);
  } else if (req.method === "POST") {
    return handlePostMovie(req, res);
  } else if (req.method === "PUT" || req.method === "PATCH") {
    return handleUpdateMovie(req, res);
  } else if (req.method === "DELETE") {
    return handleDeleteMovie(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function handleGetMovies(res: VercelResponse) {
  try {
    const movies = await Movie.find({})
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      data: movies,
      count: movies.length,
    });
  } catch (error) {
    console.error("Get movies error:", error);
    return res.status(500).json({
      error: "Failed to fetch movies",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handlePostMovie(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      title,
      budget,
      runtime,
      genre,
      popularity,
      vote_average,
      vote_count,
      cast_size = 0,
      crew_size = 0,
      shooting_days = 0,
      locations_count = 0,
      director_experience = 0,
      actor_popularity = 0,
      prediction,
      success_probability,
      status = "Pre-Production",
      spent = 0,
      progress = 0,
      poster_url: initial_poster_url = null,
    } = req.body;

    const user = verifyAuth(req);

    // Validate required fields
    if (
      !title ||
      typeof budget !== "number" ||
      typeof runtime !== "number" ||
      !genre ||
      typeof popularity !== "number" ||
      typeof vote_average !== "number" ||
      typeof vote_count !== "number" ||
      !prediction ||
      typeof success_probability !== "number"
    ) {
      return res.status(400).json({
        error: "Bad request",
        message: "Missing or invalid required fields",
      });
    }

    // Upload poster image if provided in base64
    let poster_url = initial_poster_url;
    if (req.body.poster) {
      try {
        const uploaded_url = await handleImageUpload(req);
        if (uploaded_url) {
          poster_url = uploaded_url;
        }
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        // Fallback to initial_poster_url if upload fails
      }
    }

    // Create movie record
    const movie = new Movie({
      title,
      budget,
      runtime,
      genre,
      popularity,
      vote_average,
      vote_count,
      cast_size,
      crew_size,
      shooting_days,
      locations_count,
      director_experience,
      actor_popularity,
      poster_url,
      prediction,
      success_probability,
      status,
      spent,
      progress,
      createdBy: user?.userId,
    });

    const savedMovie = await movie.save();

    return res.status(201).json({
      success: true,
      message: "Movie saved successfully",
      data: savedMovie,
    });
  } catch (error) {
    console.error("Post movie error:", error);
    return res.status(500).json({
      error: "Failed to save movie",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleUpdateMovie(req: VercelRequest, res: VercelResponse) {
  try {
    const id = req.query.id as string;
    const updates = { ...req.body };

    if (!id) {
      return res.status(400).json({ error: "Movie ID is required" });
    }

    // Upload new poster if provided in base64
    if (updates.poster && typeof updates.poster === "string" && updates.poster.length > 100) {
      try {
        const poster_url = await handleImageUpload(req);
        if (poster_url) {
          updates.poster_url = poster_url;
          delete updates.poster;
        }
      } catch (uploadError) {
        console.error("Image upload error during update:", uploadError);
      }
    }

    const updatedMovie = await Movie.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    console.error("Update movie error:", error);
    return res.status(500).json({ error: "Failed to update movie" });
  }
}

async function handleDeleteMovie(req: VercelRequest, res: VercelResponse) {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: "Movie ID is required" });
    }

    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Delete movie error:", error);
    return res.status(500).json({ error: "Failed to delete movie" });
  }
}
