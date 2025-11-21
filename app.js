import dotenv from "dotenv";
import express from "express";
import authRouter from "./route/authRouter.js";

dotenv.config({ path: `${process.cwd()}/.env` });

const PORT = process.env.APP_PORT || 4000;

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Working!!!",
  });
});

// all routes here
app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
