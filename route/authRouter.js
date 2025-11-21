import signup from "../controller/authController.js";
import express from "express";

const router = express.Router();
router.route("/signup").post(signup);

export default router;
