import express from "express";
import crypto from "crypto";
import { fetchMovies } from "./fetching-service.js";

const fetchingController = async (req, res) => {
  try {
    const providedToken = req.headers["fetch-token"];
    const correctToken = process.env.FETCH_TOKEN;

    if (!providedToken) {
      return res.status(401).json({ error: "Token required" });
    }

    const providedBuffer = Buffer.from(providedToken);
    const correctBuffer = Buffer.from(correctToken);

    if (providedBuffer.length !== correctBuffer.length) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!crypto.timingSafeEqual(providedBuffer, correctBuffer)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await fetchMovies(req.body);

    return res.status(200).json({
      message: "Seeding started successfully",
      parameters: req.body,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return res
      .status(500)
      .json({ error: "Seeding failed", details: error.message });
  }
};

const fetchingRouter = express.Router();
fetchingRouter.post("/fetch", fetchingController);

export default fetchingRouter;
