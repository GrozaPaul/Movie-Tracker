import { verifyToken } from "../utils/jwt.js";
import * as userRepository from "../features/user/user-repository.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication require. Please provide a valid token.",
      });
    }

    const verifiedToken = verifyToken(authHeader.substring(7));

    if (!verifiedToken) {
      return res.status(401).json({
        error: "Invalid or expired token.",
      });
    }

    // verifiedToken = {
    //   userId: 1,
    //   iat: 1705167890,
    //   exp: 1705772690
    // }
    const user = await userRepository.getUserById(verifiedToken.userId);

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Authentication failed.",
    });
  }
};
