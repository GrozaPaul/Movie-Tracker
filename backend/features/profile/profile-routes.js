import express from "express";
import multer from "multer";
import { authenticate } from "../../middleware/auth.js";
import * as profileController from "./profile-controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", authenticate, profileController.getProfile);
router.post("/description", authenticate, profileController.updateDescription);
router.post(
  "/picture",
  authenticate,
  upload.single("image"),
  profileController.updateProfilePicture,
);

export default router;
