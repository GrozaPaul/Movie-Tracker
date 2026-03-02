import { exec } from "child_process";
import { promisify } from "util";
import * as discoverRepository from "./discover-repository.js";

const execAsync = promisify(exec);

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const command = `.venv/bin/python3 scripts/generate_single_embedding.py "${query}"`;
    const { stdout } = await execAsync(command);

    const queryEmbedding = JSON.parse(stdout);

    const results = await discoverRepository.findSimilarMoviesByQuery(
      queryEmbedding,
      10,
    );

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
