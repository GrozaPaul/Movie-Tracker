import * as listRepository from "./list-repository.js";

export const getUserLists = async (req, res) => {
  try {
    const { userId } = req.query;
    const allLists = await listRepository.getUserLists(parseInt(userId));

    if (allLists.length === 0) {
      return res.status(200).json({
        success: true,
        allLists: [],
        message: "No lists found",
      });
    }

    return res.status(200).json(allLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getListMovies = async (req, res) => {
  try {
    const { listId } = req.query;
    const listMovies = await listRepository.getListMovies(parseInt(listId));
    return res.status(200).json(listMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createList = async (req, res) => {
  try {
    const listData = req.body;
    const createdList = await listRepository.createList(listData);
    return res.status(201).json({ success: true, createdList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMovieToList = async (req, res) => {
  try {
    const { listId, movieId } = req.body;
    await listRepository.addMovieToList(listId, movieId);
    return res
      .status(200)
      .json({ message: `Added movie ${movieId} to list ${listId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteList = async (req, res) => {
  try {
    const { listId } = req.body;
    const result = await listRepository.deleteList(parseInt(listId));

    if (result.affected === 0) {
      return res.status(404).json({ error: "List not found" });
    }

    return res.status(200).json({ message: `List ${listId} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeMovieFromList = async (req, res) => {
  try {
    const { listId, movieId } = req.body;
    await listRepository.removeMovieFromList(listId, movieId);
    return res
      .status(200)
      .json({ message: `Removed movie ${movieId} from list ${listId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
