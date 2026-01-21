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

export const seeding = async (totalPagesToFetch = 500) => {
  try {
    const movieIds =
      await tmdbApi.fetchMovieIdsByDiscoverTMDB(totalPagesToFetch);

    const movies = await tmdbApi.fetchMovieDetailsByIds(movieIds);

    const { actorsIds, directorsIds } =
      extractUniqueActorsAndDirectorsIds(movies);
    const allPersonIds = [...new Set([...actorsIds, ...directorsIds])];

    const people = await tmdbApi.fetchPeopleDetailsByIds(allPersonIds);

    let savedPeopleCount = 0;
    for (const person of people) {
      const personData = transformPersonData(person);
      const saved = await movieRepoTmdb.savePerson(personData);
      if (saved) savedPeopleCount++;
    }
    console.log(`Saved ${savedPeopleCount} people\n`);
  } catch (error) {}
};
