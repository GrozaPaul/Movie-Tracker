import Joi from "joi";

export const fetchMovieFromTMDBDto = Joi.object({
  movieId: Joi.integer().required(),
  title: Joi.string().required(),
  overview: Joi.string().required(),
  releaseDate: Joi.string().required(),
  backdropPath: Joi.string().required(),
  posterPath: Joi.string().required(),
  runtime: Joi.integer().required(),
  country: Joi.string().required(),
  originalLanguage: Joi.string().required(),
  spokenLanguages: Joi.array().items(Joi.string()),
  director: Joi.string().required(),
});
