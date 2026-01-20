import * as movieRepository from "./movieRepository.js";
import * as tmdb from "../../utils/tmdb.js";

export const fetchMovieDataTMDB = async () => {
  const movieIds = await tmdb.fetchMovieIdsByDiscoverTMDB();
  const movies = await tmdb.fetchMovieDetailsByIds(movieIds);

  // manipulating movies to extract only what and how is needed for my movie entity

  return await movieRepository.saveMovieFromTMDB(movies);
};

export const saveMovieFromTMDB = async (movieData) => {
  return await movieRepository.saveMovieFromTMDB(movieData);
};
