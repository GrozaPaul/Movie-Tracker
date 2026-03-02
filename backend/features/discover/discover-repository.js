import { movieRepository } from "../movie/movie-repository.js";
import { In, IsNull, Not } from "typeorm";
import { cosineSimilarity } from "../../utils/similarity.js";

export const findSimilarMoviesByQuery = async (queryEmbedding, limit = 5) => {
  const movies = await movieRepository.find({
    where: { embeddingJson: Not(IsNull()) },
    select: {
      movieId: true,
      embeddingJson: true,
    },
  });

  const topMatches = movies
    .map((movie) => {
      const movieEmbedding =
        typeof movie.embeddingJson === "string"
          ? JSON.parse(movie.embeddingJson)
          : movie.embeddingJson;

      return {
        movieId: movie.movieId,
        similarity: parseFloat(
          cosineSimilarity(queryEmbedding, movieEmbedding).toFixed(4),
        ),
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  const topIds = topMatches.map((m) => m.movieId);

  const detailedMovies = await movieRepository.find({
    where: { movieId: In(topIds) },
    select: {
      movieId: true,
      title: true,
      posterPath: true,
      overview: true,
    },
  });

  return topMatches.map(({ movieId, similarity }) => ({
    ...detailedMovies.find((m) => m.movieId === movieId),
    similarity,
  }));
};
