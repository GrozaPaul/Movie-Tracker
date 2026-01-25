import express from "express";
import { seeding } from "./seeding-service.js";

const methodOfGettingMovieIds = ["releasedIn: year", "from country: country"];

const args = {
  totalPagesToFetch: "integer",
  methodOfGettingMovieIds: "string",
};

const fetchingController = async (req, res) => {
  try {
    const providedToken = req.headers["x-fetch-token"];
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

    await seeding(req.body);

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

const seedingRouter = express.Router();
seedingRouter.post("/fetch", fetchingController);

export default seedingRouter;
