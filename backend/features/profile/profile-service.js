import * as profileRepository from "./profile-repository.js";
import { getImageUrl } from "../../minio.js";
import {
  noOfWatchlistedMovies,
  getLastThreeAdded,
} from "../watchlist/watchlist-repository.js";
import {
  getLastFourWatched,
  getAllUserRatings,
} from "../watched/watched-repository.js";
import { getUserLists, getFirstMoviesInList } from "../list/list-repository.js";
import { getUserTags } from "../tag/tag-repository.js";

const getNoOfMoviesWatched = async (userId) => {
  return await profileRepository.noOfMoviesWatched(userId);
};

const getDescription = async (userId) => {
  const desc = await profileRepository.getDescription(userId);
  return desc.description;
};

const getLastWatchlisted = async (userId) => {
  const count = await noOfWatchlistedMovies(userId);
  const movies = await getLastThreeAdded(userId);

  const lastPosters = movies.map((m) =>
    getImageUrl(`posters/${m.movieId}_poster.jpg`),
  );

  return {
    count,
    lastPosters,
  };
};

const getLastWatched = async (userId) => {
  const watched = await getLastFourWatched(userId);
  return watched.map((movie) => ({
    movieId: movie.movie.movieId,
    title: movie.movie.title,
    releaseDate: movie.movie.releaseDate,
    rating: movie.rating,
    posterUrl: getImageUrl(`posters/${movie.movie.movieId}_poster.jpg`),
  }));
};

const getListsAndFirstMovies = async (userId) => {
  const lists = await getUserLists(userId);

  return await Promise.all(
    lists.map(async (l) => ({
      ...l,
      urls: await getFirstMoviesInList(l.listId),
    })),
  );
};

const r = {
  nota: "count",
};

const getRatings = async (userId) => {
  const result = {};
  const ratings = await getAllUserRatings(userId);

  ratings.forEach((r) => {
    if (r.rating in result) {
      result[r.rating] += 1;
    } else {
      result[r.rating] = 1;
    }
  });

  const totalRatings = ratings.length;

  return Object.fromEntries(
    Object.entries(result).map(([rating, count]) => [
      rating,
      {
        count,
        percentage: Number(((count / totalRatings) * 100).toFixed(2)),
      },
    ]),
  );
};

export const getProfile = async (userId) => {
  return {
    noOfMoviesWatched: await getNoOfMoviesWatched(userId),
    profilePicture: getImageUrl(`avatars/${userId}_avatar.jpg`),
    description: await getDescription(userId),
    watchlist: await getLastWatchlisted(userId),
    watched: await getLastWatched(userId),
    lists: await getListsAndFirstMovies(userId),
    tags: await getUserTags(userId),
    ratings: await getRatings(userId),
  };
};
