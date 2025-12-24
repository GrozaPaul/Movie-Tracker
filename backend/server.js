import express from "express";
import userRouter from "./user/user.routes.js";
import filmRouter from "./film/film.routes.js";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
  console.log("Development: Using .env file");
} else {
  console.log("Production: Environment variables set by secret manager");
}

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

const app = express();
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Root");
});

app.use("/user", userRouter);
app.use("/film", filmRouter);

app.listen(PORT);
