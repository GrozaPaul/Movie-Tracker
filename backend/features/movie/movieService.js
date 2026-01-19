import * as movieRepository from "./movieRepository.js";
import * as tmdb from "../../utils/tmdb.js";

export const fetchMovieDataTMDB = async () => {
  // call tmdb api
  // data manipulation

  let movieTitle = "Jumanji";
  const movie = await tmdb.fetchMovieByTitle(movieTitle);
  console.log(JSON.stringify(movie, null, 2));
};

export const saveMovieFromTMDB = async (movieData) => {
  return await movieRepository.saveMovieFromTMDB(movieData);
};

fetchMovieDataTMDB();
