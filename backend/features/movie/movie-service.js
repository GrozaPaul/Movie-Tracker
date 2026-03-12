import * as movieRepository from "./movie-repository.js";
import { getImageUrl } from "../../minio.js";

export const getAllMovies = async () => {
  const movies = await movieRepository.getAllMovies();
  return movies;
};
