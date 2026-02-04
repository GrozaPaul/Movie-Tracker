import Joi from "joi";

export const saveWatchedMovie = Joi.object({
  userId: Joi.number().integer().required(),
  movieId: Joi.number().integer().required(),
  isFavorite: Joi.boolean().optional().default(false),
  rating: Joi.number().integer().min(1).max(10).optional().allow(null),
  review: Joi.string().max(4000).trim().optional().allow(null),
});
