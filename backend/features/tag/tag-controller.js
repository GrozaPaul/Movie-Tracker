import * as tagRepository from "./tag-repository.js";

// export const getUserTags = async (req, res) => {
//   try {
//     const usersId = parseInt(req.params.userId);
//
//     const allTags = await tagRepository.getUserTags(usersId);
//     res.status(200).json({ success: true, allTags });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
//
// export const getMoviesByTag = async (req, res) => {
//   try {
//     const { userId, tagName } = req.body;
//     const allMovies = await tagRepository.getMoviesByTag(userId, tagName);
//     res.status(200).json({ success: true, allMovies });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
//
// export const getMovieTags = async (req, res) => {
//   try {
//     const { userId, movieId } = req.body;
//     const allTagsOfMovie = await tagRepository.getMovieTags(userId, movieId);
//     res.status(200).json({ success: true, allTagsOfMovie });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const get = async (req, res) => {
  try {
    const { userId, movieId, tagName } = req.query;

    if (userId && !movieId && !tagName) {
      const allTags = await tagRepository.getUserTags(parseInt(userId));
      return res.status(200).json({ success: true, allTags });
    }

    if (userId && !movieId && tagName) {
      const allMovies = await tagRepository.getMoviesByTag(
        parseInt(userId),
        tagName,
      );
      return res.status(200).json({ success: true, allMovies });
    }

    if (userId && movieId && !tagName) {
      const movieTags = await tagRepository.getMovieTags(
        parseInt(userId),
        parseInt(movieId),
      );
      return res.status(200).json({ success: true, movieTags });
    }

    return res.status(400).json({
      error:
        "Invalid query parameters. Use: userId, userId+tagName, or userId+movieId",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addTagToMovie = async (req, res) => {
  try {
    const tagData = req.body;
    const addedTag = await tagRepository.addTagToMovie(tagData);
    res.status(200).json({ success: true, addedTag });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeTagFromMovie = async (req, res) => {
  try {
    const tagData = req.body;
    const result = await tagRepository.removeTagFromMovie(tagData);

    if (result.affected === 0) {
      return res.status(404).json({ error: "Tag for movie not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
