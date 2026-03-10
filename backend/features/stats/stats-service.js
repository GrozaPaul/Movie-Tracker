import * as statsRepository from "./stats-repository.js";
import { watchedMovies } from "./stats-repository.js";

const transformMovieData = (movie) => ({
  movieId: movie.movieId,
  title: movie.title,
  runtime: Number(movie.runtime),
  rating: movie.rating !== null ? Number(movie.rating) : null,
  country: movie.country.map((c) => c.countryName),
  genres: movie.genres.map((g) => g.genreName),
  directors: movie.directors.map((d) => ({
    name: d.person.name,
    profilePicturePath: d.person.profilePicturePath,
  })),
});

const sortPersonByCount = (arr) => {
  return Object.fromEntries(
    Object.entries(arr)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10),
  );
};

const sortPersonByAverageRate = (arr) => {
  return Object.fromEntries(
    Object.entries(arr)
      .filter(([name, stats]) => stats.noOfRates > 0)
      .map(([name, stats]) => [
        name,
        {
          ...stats,
          average: Number((stats.sumOfRates / stats.noOfRates).toFixed(2)),
        },
      ])
      .sort((a, b) => b[1].average - a[1].average)
      .slice(0, 10),
  );
};

const noOfMoviesWatched = (watchedMovies) => {
  return watchedMovies.length;
};

const totalRuntimeWatched = (watchedMovies) => {
  return watchedMovies.reduce((acc, movie) => acc + movie.runtime, 0);
};

const noOfCountriesWatched = (watchedMovies) => {
  return [...new Set(watchedMovies.map((movie) => movie.country).flat())]
    .length;
};

const noOfDirectorsWatched = (watchedMovies) => {
  return [
    ...new Set(
      watchedMovies.map((movie) => movie.directors.map((d) => d.name)).flat(),
    ),
  ].length;
};

const noOfActorsWatched = async (userId) => {
  return await statsRepository.watchedActorsCount(parseInt(userId));
};

const watchedGenres = (watchedMovies) => {
  const watchedGenres = {};
  watchedMovies.forEach((movie) => {
    movie.genres.forEach((genre) => {
      if (genre in watchedGenres) watchedGenres[genre]++;
      else watchedGenres[genre] = 1;
    });
  });
  return watchedGenres;
};

const buildDirectors = (watchedMovies) => {
  const result = {};
  watchedMovies.forEach((movie) => {
    movie.directors.forEach((director) => {
      if (director.name in result) {
        result[director.name].count++;
        if (movie.rating !== null) {
          result[director.name].sumOfRates += movie.rating;
          result[director.name].noOfRates += 1;
        }
      } else {
        result[director.name] = {
          count: 1,
          profilePicturePath: director.profilePicturePath,
          sumOfRates: movie.rating !== null ? movie.rating : 0,
          noOfRates: movie.rating !== null ? 1 : 0,
        };
      }
    });
  });
  return result;
};

const buildActors = (watchedActors, watchedMovies) => {
  const result = {};
  watchedActors.forEach((item) => {
    const movie = watchedMovies.find((m) => m.movieId === item.movieId);
    const rating = movie ? movie.rating : null;

    item.actors.forEach((act) => {
      if (act.name in result) {
        result[act.name].count++;
        if (rating !== null) {
          result[act.name].sumOfRates += rating;
          result[act.name].noOfRates += 1;
        }
      } else {
        result[act.name] = {
          count: 1,
          profilePicturePath: act.profilePicturePath,
          sumOfRates: rating !== null ? rating : 0,
          noOfRates: rating !== null ? 1 : 0,
        };
      }
    });
  });
  return result;
};

export const getStats = async (userId) => {
  const watchedMovies = (await statsRepository.watchedMovies(userId)).map(
    transformMovieData,
  );

  const directors = buildDirectors(watchedMovies);

  const watchedActors = await statsRepository.watchedActors(userId);
  const actors = buildActors(watchedActors, watchedMovies);

  return {
    noOfMoviesWatched: noOfMoviesWatched(watchedMovies),
    totalRuntimeWatched: totalRuntimeWatched(watchedMovies),
    noOfCountriesWatched: noOfCountriesWatched(watchedMovies),
    noOfDirectorsWatched: noOfDirectorsWatched(watchedMovies),
    noOfActorsWatched: await noOfActorsWatched(userId),
    watchedGenres: watchedGenres(watchedMovies),
    mostWatchedDirectors: sortPersonByCount(directors),
    highestRatedDirectors: sortPersonByAverageRate(directors),
    mostWatchedActors: sortPersonByCount(actors),
    highestRatedActors: sortPersonByAverageRate(actors),
  };
};

export const getActors = async (userId) => {
  return await statsRepository.watchedActors(userId);
};
