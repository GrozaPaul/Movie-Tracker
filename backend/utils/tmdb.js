import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const fetchMovieIdsByDiscoverTMDB = async (totalPages = 1000) => {
  const allMovieIds = [];
  const batchSize = 10;

  for (let i = 0; i < totalPages; i += batchSize) {
    const batch = [];

    for (
      let page = i + 1;
      page <= Math.min(i + batchSize, totalPages);
      page++
    ) {
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;

      batch.push(
        fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          },
        }).then((res) => res.json()),
      );
    }

    try {
      const results = await Promise.all(batch);

      results.forEach((data) => {
        const movieIds = data.results.map((movie) => movie.id);
        allMovieIds.push(...movieIds);
      });

      console.log(
        `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(totalPages / batchSize)} - Total IDs: ${allMovieIds.length}`,
      );
    } catch (error) {
      console.error(
        `Batch error at pages ${i + 1}-${Math.min(i + batchSize, totalPages)}:`,
        error,
      );
    }
  }

  return allMovieIds;
};

// TMDM - Movies/Details
// (entire movie table except director,
// movie_genre table,
// entire studio_movies table)
export const fetchMovieDetailsByIds = async (movieIds) => {
  const allMoviesData = [];
  const batchSize = 10; // Process 10 movies at a time

  for (let i = 0; i < movieIds.length; i += batchSize) {
    const batch = [];

    // Create batch of fetch promises
    const currentBatch = movieIds.slice(i, i + batchSize);

    for (const movieId of currentBatch) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits&language=en-US`;

      batch.push(
        fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          },
        }).then((res) => res.json()),
      );
    }

    try {
      // Wait for all requests in this batch to complete
      const results = await Promise.all(batch);

      // Add all movie data to array
      allMoviesData.push(...results);

      console.log(
        `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(movieIds.length / batchSize)} - Total movies: ${allMoviesData.length}`,
      );
    } catch (error) {
      console.error(
        `Batch error at movies ${i}-${Math.min(i + batchSize, movieIds.length)}:`,
        error,
      );
    }
  }

  return allMoviesData; // Returns array of complete movie objects with credits and production companies
};

// TMDB - Search/Movie
export const fetchMovieByTitle = async (movieTitle) => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${movieTitle}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  };
  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// TMDB - Movies/Credits (director filed in movie table, entire movie_actor table)
export const getMovieCreditsByTMDBId = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// TMDB - Genres/Movie List
export const getAllGenres = async () => {
  const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// People/Movie Credits - get movies for an actor
