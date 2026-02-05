import express from "express";
import userRouter from "./features/user/user-routes.js";
import watchedRouter from "./features/watched/watched-routes.js";
import watchlistRouter from "./features/watchlist/watchlist-routes.js";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initializeDatabase } from "./typeorm-config.js";
import { initializeBucket } from "./minio.js";
import fetchingRouter from "./features/tmdb-fetching/fetching-controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const EXPRESS_PORT = process.env.EXPRESS_PORT;
const NODE_ENV = process.env.NODE_ENV;

const app = express();
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/watched", watchedRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/tmdb", fetchingRouter);

export const startServer = async () => {
  try {
    await initializeDatabase();
    await initializeBucket();
    app.listen(EXPRESS_PORT);
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

const isMainModule = process.argv[1].includes("server.js");
if (isMainModule) {
  startServer();
}
