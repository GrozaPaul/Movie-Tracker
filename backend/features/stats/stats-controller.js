import * as statsService from "./stats-service.js";

export const statsController = async (req, res) => {
  try {
    const { userId } = req.query;

    const stats = await statsService.getStats(parseInt(userId));

    res.status(200).json(stats);
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const getActors = async (req, res) => {
  try {
    const { userId } = req.query;

    const actors = await statsService.getActors(parseInt(userId));

    res.status(200).json(actors);
  } catch (error) {
    res.json({ error: error.message });
  }
};
