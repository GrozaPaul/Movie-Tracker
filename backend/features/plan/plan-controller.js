import * as planRepository from "./plan-repository.js";

export const getAllPlanned = async (req, res) => {
  try {
    const { userId } = req.query;
    const allPlanned = await planRepository.getAllPlanned(parseInt(userId));
    return res.status(200).json({ success: true, allPlanned });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMovieToPlan = async (req, res) => {
  try {
    const planData = req.body;
    const added = await planRepository.addMovieToPlan(planData);
    return res.status(200).json({ success: true, added });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markMovieAsWatched = async (req, res) => {
  try {
    const markData = req.body;
    const marked = await planRepository.markMovieAsWatched(markData);

    if (marked.affected === 0) {
      return res.status(404).json({ error: "Tag for movie not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromPlan = async (req, res) => {
  try {
    const removeData = req.body;
    const removed = await planRepository.removeFromPlan(removeData);

    if (removed.affected === 0) {
      return res.status(404).json({ error: "Tag for movie not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
