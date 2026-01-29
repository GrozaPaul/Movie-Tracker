import * as tmdbApi from "./tmdb-api.js";
import * as fetchingRepository from "./fetching-repository.js";
import { initializeDatabase } from "../../typeorm-config.js";

const extractUniqueActorsAndDirectorsIds = (movies) => {
  const actorIds = new Set();
  const directorIds = new Set();

  for (const movie of movies) {
    const cast = movie.credits.cast;
    cast.forEach((actor) => actorIds.add(actor.id));

    const directors = movie.credits.crew.filter(
      (crewMember) => crewMember.job === "Director",
    );
    directors.forEach((director) => directorIds.add(director.id));
  }

  return {
    actorsIds: Array.from(actorIds),
    directorsIds: Array.from(directorIds),
  };
};

const cleanBiography = (biography) => {
  if (!biography) return null;

  const toBeRemovedIndex = biography.indexOf("Description above from the");

  if (toBeRemovedIndex === -1) return biography.trim();

  return biography.substring(0, toBeRemovedIndex);
};

const transformPersonData = (tmdbPerson) => {
  return {
    personId: tmdbPerson.id,
    name: tmdbPerson.name,
    biography: cleanBiography(tmdbPerson.biography),
    profilePicturePath: tmdbPerson.profile_path,
  };
};

const transformMovieData = (tmdbMovie) => {
  return {
    movieId: tmdbMovie.id,
    title: tmdbMovie.title,
    overview: tmdbMovie.overview,
    releaseDate: tmdbMovie.release_date,
    backdropPath: tmdbMovie.backdrop_path,
    posterPath: tmdbMovie.poster_path,
    runtime: tmdbMovie.runtime,
    originalLanguage:
      tmdbMovie.spoken_languages.find(
        (language) => language.iso_639_1 === tmdbMovie.original_language,
      )?.english_name || tmdbMovie.original_language,
    spokenLanguages:
      tmdbMovie.spoken_languages?.map((language) => language.english_name) ||
      [],
    originalTitle: tmdbMovie.original_title,
    tagline: tmdbMovie.tagline,
  };
};

const filterMovieIdsToBeNew = async (movieIds) => {
  const existingMovieIdsSet = new Set(
    await fetchingRepository.getAllExistingMovieIds(),
  );
  return movieIds.filter((id) => !existingMovieIdsSet.has(id));
};

const filterPersonIdsToBeNew = async (personIds) => {
  const existingPersonIdsSet = new Set(
    await fetchingRepository.getAllExistingPersonIds(),
  );
  return personIds.filter((id) => !existingPersonIdsSet.has(id));
};

const filterMovies = (movies) => {
  return movies.filter((movie) => Number(movie.runtime) >= 60);
};

export const fetchMovies = async (options) => {
  try {
    console.log("I. Fetching movie IDs\n");
    const movieIds = [
      ...new Set(await tmdbApi.fetchMovieIdsByDiscoverTMDB(options)),
    ];
    console.log(`Fetched ${movieIds.length} movie IDs from TMDB`);

    const newMovieIds = await filterMovieIdsToBeNew(movieIds);
    console.log(`New movies to fetch: ${newMovieIds.length}`);
    console.log(`Already exist: ${movieIds.length - newMovieIds.length}`);

    console.log("II. Fetching movies details\n");
    const movies = await tmdbApi.fetchMovieDetailsByIds(newMovieIds);
    console.log(`Fetched details for ${movies.length} movies`);

    const filteredMovies = filterMovies(movies);
    console.log(
      `After runtime filter: ${filteredMovies.length} movies (${movies.length - filteredMovies.length} had runtime < 60)`,
    );

    console.log("III. Extracting unique people IDs\n");
    const { actorsIds, directorsIds } =
      extractUniqueActorsAndDirectorsIds(filteredMovies);
    const allPersonIds = [...new Set([...actorsIds, ...directorsIds])];
    console.log(
      `Found ${allPersonIds.length} unique people in ${filteredMovies.length} movies. ${actorsIds.length} actors, ${directorsIds.length} directors\n`,
    );

    const newPersonIds = await filterPersonIdsToBeNew(allPersonIds);
    console.log(
      `Filtered down to ${newPersonIds.length} new people (${allPersonIds.length - newPersonIds.length} already exist)`,
    );

    console.log("IV. Fetching person details\n");
    const people = await tmdbApi.fetchPeopleDetailsByIds(newPersonIds);
    console.log(`Fetched ${people.length} person details\n`);

    console.log("V. Saving people to database\n");
    let savedPeopleCount = 0;
    for (const person of people) {
      const personData = transformPersonData(person);
      const saved = await fetchingRepository.savePerson(personData);
      if (saved) savedPeopleCount++;
    }
    console.log(`Saved ${savedPeopleCount} people\n`);

    console.log("VI. Saving movies and their relations to database\n");
    let savedMoviesCount = 0;
    let errorCount = 0;

    for (const movie of filteredMovies) {
      try {
        const movieData = transformMovieData(movie);
        await fetchingRepository.saveMovie(movieData);

        await fetchingRepository.saveGenresForMovie(movie.id, movie.genres);

        const cast = movie.credits.cast;
        if (cast.length > 0)
          await fetchingRepository.saveActorsForMovie(movie.id, cast);

        const directors = movie.credits.crew.filter(
          (crew) => crew.job === "Director",
        );
        if (directors.length > 0)
          await fetchingRepository.saveDirectorsForMovie(movie.id, directors);

        if (movie.production_companies?.length > 0)
          await fetchingRepository.saveStudiosForMovie(
            movie.id,
            movie.production_companies,
          );

        if (movie.production_countries?.length > 0) {
          const countryNames = movie.production_countries.map((c) => c.name);
          await fetchingRepository.saveCountryForMovie(movie.id, countryNames);
        }

        savedMoviesCount++;
      } catch (error) {
        console.error(
          `Error saving movies ${movie.id} ${movie.title}`,
          error.message,
        );
        errorCount++;
      }
    }

    console.log(`\nSeeding complete!\n`);
    console.log(`Movies saved: ${savedMoviesCount}`);
    console.log(`People saved: ${savedPeopleCount}`);
    console.log(`Errors: ${errorCount}`);
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  }
};
