import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const fetchMovieIdsByDiscoverTMDB = async (options) => {
  const { totalPages, sortBy, filters } = options;
  const {
    primaryReleaseYear,
    primaryReleaseDateGte,
    primaryReleaseDateLte,
    withOriginCountry,
    withOriginalLanguage,
  } = filters;

  const allMovieIds = [];
  const batchSize = 10;

  for (let i = 0; i < totalPages; i += batchSize) {
    const batch = [];

    for (
      let page = i + 1;
      page <= Math.min(i + batchSize, totalPages);
      page++
    ) {
      const url =
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US` +
        `&page=${page}` +
        `${primaryReleaseYear !== "" ? `&primary_release_year=${primaryReleaseYear}` : ""}` +
        `${primaryReleaseDateGte !== "" ? `&primary_release_date.gte=${primaryReleaseDateGte}` : ""}` +
        `${primaryReleaseDateLte !== "" ? `&primary_release_date.lte=${primaryReleaseDateLte}` : ""}` +
        `&sort_by=${sortBy}` +
        `${withOriginCountry !== "" ? `&with_origin_country=${withOriginCountry}` : ""}` +
        `${withOriginalLanguage !== "" ? `&with_original_language=${withOriginalLanguage}` : ""}` +
        `&with_runtime.gte=60`;

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
export const fetchMovieDetailsByIds = async (movieIds) => {
  const allMoviesData = [];
  const batchSize = 10;

  for (let i = 0; i < movieIds.length; i += batchSize) {
    const batch = [];

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
      const results = await Promise.all(batch);

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

  return allMoviesData;
};

export const fetchPeopleDetailsByIds = async (personIds) => {
  const allPeopleData = [];
  const batchSize = 10;

  for (let i = 0; i < personIds.length; i += batchSize) {
    const batch = [];
    const currentBatch = personIds.slice(i, i + batchSize);

    for (const personId of currentBatch) {
      const url = `https://api.themoviedb.org/3/person/${personId}?language=en-US`;

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
      allPeopleData.push(...results);

      console.log(
        `Fetched people batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(personIds.length / batchSize)} - Total: ${allPeopleData.length}`,
      );
    } catch (error) {
      console.error(`Batch error fetching people:`, error);
    }
  }

  return allPeopleData;
};

export const fetchPersonDetails = async (personId) => {
  const url = `https://api.themoviedb.org/3/person/${personId}?language=en-US`;
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
    console.error(`Error fetching person ${personId}:`, error);
    throw error;
  }
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
