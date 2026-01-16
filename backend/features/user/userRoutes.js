import express from "express";
import * as userController from "./userController.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

// for future endpoints: createUser and loginUser do not require authenticate middleware.
// everything else does; between the path and the controller

//
router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.delete(
  "/delete/current",
  authenticate,
  userController.deleteCurrentUser,
);

export default router;
