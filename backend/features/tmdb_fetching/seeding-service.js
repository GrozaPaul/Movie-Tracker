import * as tmdbApi from "./tmdb-api.js";
import * as movieRepoTmdb from "./movie-repository-tmdb.js";

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
    country: tmdbMovie.production_countries?.[0]?.name || null,
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

export const seeding = async (totalPagesToFetch = 500) => {
  try {
    console.log("I. Fetching movie IDs\n");
    const movieIds =
      await tmdbApi.fetchMovieIdsByDiscoverTMDB(totalPagesToFetch);
    console.log(`Fetched ${movieIds.length} movie IDs\n`);

    console.log("II. Fetching movies details\n");
    const movies = await tmdbApi.fetchMovieDetailsByIds(movieIds);
    console.log(`Fetched ${movies.length} movies\n`);

    console.log("III. Extracting unique people IDs\n");
    const { actorsIds, directorsIds } =
      extractUniqueActorsAndDirectorsIds(movies);
    const allPersonIds = [...new Set([...actorsIds, ...directorsIds])];
    console.log(
      `Found ${allPersonIds.length} unique people. ${actorsIds.length} actors, ${directorsIds.length} directors\n`,
    );

    console.log("IV. Fetching person details\n");
    const people = await tmdbApi.fetchPeopleDetailsByIds(allPersonIds);
    console.log(`Fetched ${people.length} person details\n`);

    console.log("V. Saving people to database\n");
    let savedPeopleCount = 0;
    for (const person of people) {
      const personData = transformPersonData(person);
      const saved = await movieRepoTmdb.savePerson(personData);
      if (saved) savedPeopleCount++;
    }
    console.log(`Saved ${savedPeopleCount} people\n`);

    console.log("VI. Saving movies and their relations to database\n");
    let savedMoviesCount = 0;
    let errorCount = 0;

    for (const movie of movies) {
      try {
        const movieData = transformMovieData(movie);
        await movieRepoTmdb.saveMovie(movieData);

        await movieRepoTmdb.saveGenresForMovie(movie.id, movie.genres);

        const cast = movie.credits.cast;
        if (cast.length > 0)
          await movieRepoTmdb.saveActorsForMovie(movie.id, cast);

        const directors = movie.credits.crew.filter(
          (crew) => crew.job === "Director",
        );
        if (directors.length > 0)
          await movieRepoTmdb.saveDirectorsForMovie(movie.id, directors);

        if (movie.production_companies?.length > 0)
          await movieRepoTmdb.saveStudiosForMovie(
            movie.id,
            movie.production_companies,
          );

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
