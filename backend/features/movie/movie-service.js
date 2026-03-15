import * as movieRepository from "./movie-repository.js";
import { getImageUrl } from "../../minio.js";
import { findOne } from "../watched/watched-repository.js";
import { getRatingsAndReviews } from "./movie-repository.js";
import { getUserById, getUsernameById } from "../user/user-repository.js";

export const getAllMovies = async () => {
  const movies = await movieRepository.getAllMovies();

  return movies.map((m) => ({
    ...m,
    releaseDate: m.releaseDate.slice(0, 4),
    genres: m.genres.map((g) => g.genreName),
    posterUrl: getImageUrl(`posters/${m.movieId}_poster.jpg`),
  }));
};

const calculateAverageAndDistributionRate = async (movieId) => {
  const ratings = (await getRatingsAndReviews(movieId)).map((r) => r.rating);

  const resultRatings = {};
  ratings.forEach((r) => {
    if (r in resultRatings) {
      resultRatings[r] += 1;
    } else {
      resultRatings[r] = 1;
    }
  });

  const totalRatings = ratings.length;
  const sumOfRatings = ratings.reduce((acc, value) => acc + Number(value), 0);

  return {
    average: Number((sumOfRatings / totalRatings).toFixed(2)),
    distribution: Object.fromEntries(
      Object.entries(resultRatings).map(([rating, count]) => [
        rating,
        {
          count,
          percentage: Number(((count / totalRatings) * 100).toFixed(2)),
        },
      ]),
    ),
  };
};

const getReviewsOfMovie = async (movieId) => {
  const reviews = await getRatingsAndReviews(movieId);

  return await Promise.all(
    reviews.map(async (r) => ({
      ...r,
      avatarUrl: getImageUrl(`avatars/${r.userId}_avatar.jpg`),
      username: (await getUsernameById(r.userId)).username,
    })),
  );
};

export const getMovie = async (movieId, userId) => {
  const movieDetails = await movieRepository.getMovieDetails(movieId, userId);
  const actors = (await movieRepository.getMovieActors(movieId)).map((a) => ({
    ...a,
    person: a.person.name,
  }));

  const director = (await movieRepository.getMovieDirector(movieId)).map(
    (a) => ({
      ...a,
      person: a.person.name,
    }),
  );

  movieDetails.countries = (
    await movieRepository.getMovieCountries(movieId)
  ).map((c) => c.countryName);

  movieDetails.studios = (await movieRepository.getMovieStudios(movieId)).map(
    (s) => s.studioName,
  );

  movieDetails.posterUrl = getImageUrl(`posters/${movieId}_poster.jpg`);
  movieDetails.backdropUrl = getImageUrl(`backdrops/${movieId}_backdrop.jpg`);
  movieDetails.rate = await findOne(userId, movieId);

  return {
    ...movieDetails,
    actors,
    director,
    ratings: await calculateAverageAndDistributionRate(movieId),
    reviews: await getReviewsOfMovie(movieId),
  };
};
